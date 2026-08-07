import math

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from pydantic import BaseModel, ConfigDict, Field, EmailStr
from infra.repositories.order_repository import OrderRepository
from domain.entities.vehicle import Vehicle
from domain.enums.vehicle_type import VehicleType
from services.logistics_service import LogisticsService
from domain.entities.purchase_order import PurchaseOrder
from infra.scanner.json_scanner import JSONScanner
from infra.scanner.pdf_scanner import PDFScanner
from infra.scanner.scanner_interface import ScannerInterface
from core.security import create_access_token, decode_access_token
from services.user_service import UserService

router = APIRouter()
user_service = UserService()
security = HTTPBearer()

class UserSchema(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)
    
    name: str = Field(..., min_length=1, description="O nome não pode ser vazio.")
    email: EmailStr = Field(..., description="Deve ser um e-mail válido.")
    password: str = Field(..., min_length=6, description="A senha deve ter no mínimo 6 caracteres.")
    role: str = Field(..., min_length=1)


class LoginSchema(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)
    
    email: EmailStr = Field(..., description="E-mail do usuário.")
    password: str = Field(..., min_length=1, description="Senha do usuário.")


async def get_current_user(auth: HTTPAuthorizationCredentials = Depends(security)):

    payload = decode_access_token(auth.credentials)
    if not payload:
        raise HTTPException(
            status_code=401,
            detail="Sessão inválida ou expirada. Por favor, faça login novamente.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return payload


@router.post("/register")
async def register(data: UserSchema):
    user = await user_service.create_user(data)
    if not user:
        raise HTTPException(status_code=400, detail="Erro ao criar usuário.")
    return user


@router.post("/login")
async def login(credentials: LoginSchema):
    email = credentials.email.strip()
    password = credentials.password.strip()
    
    user = await user_service.get_by_email(email)
    
    if not user:
        raise HTTPException(status_code=401, detail="E-mail ou senha incorretos.")

    is_valid = user_service.verify_user_password(password, user.password)
    
    if not is_valid:
        raise HTTPException(status_code=401, detail="E-mail ou senha incorretos.")
    
    token = create_access_token(data={
        "sub": user.email, 
        "role": str(user.role),
        "id": str(user.id)
    })
    
    await user_service.update_last_login(user.id)

    return {
        "user": user.to_dict(),
        "access_token": token,
        "token_type": "bearer"
    }


@router.post("/scan")
async def scan(file: UploadFile = File(...), current_user: dict = Depends(get_current_user)):

    content = await file.read()
    file_extension = file.filename.split(".")[-1].lower()

    scanner: ScannerInterface = None
    match file_extension:
        case "pdf":
            scanner = PDFScanner()
        case "json":
            scanner = JSONScanner()
        case _:
            raise HTTPException(status_code=415, detail=f"Extensão .{file_extension} não suportada. Envie PDF ou JSON.")
        
    result: PurchaseOrder = scanner.scan(content, created_by_id=current_user["id"])

    return result.to_dict()


@router.post("/orders/calculate")
async def calculate_volume(order_data: dict, current_user: dict = Depends(get_current_user)):
    try:
        order = PurchaseOrder.from_dict(order_data)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Erro na estrutura do pedido: {str(e)}")

    order._vehicles = []

    service = LogisticsService()
    total_volume = service.calculate_total_volume(order)
    
    order.total_volume_m3 = total_volume

    remaining_volume = total_volume

    if remaining_volume >= 60:
        num_carretas = int(remaining_volume // 60)
        order.add_vehicle(Vehicle(60.0, VehicleType.CARRETA, num_carretas))
        remaining_volume %= 60

    if remaining_volume > 0:
        num_trucks = math.ceil(remaining_volume / 45)
        order.add_vehicle(Vehicle(45.0, VehicleType.TRUCK, num_trucks))
    
    return order.to_dict()


@router.post("/orders/quote")
async def final_quote(quote_request: dict, current_user: dict = Depends(get_current_user)):
    try:
        order = PurchaseOrder.from_dict(quote_request)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Erro na estrutura do pedido: {str(e)}")
    
    service = LogisticsService()
    result = service.calculate_final_quote(order)

    return result.to_dict()


@router.post("/orders/save")
async def save_order(order_data: dict, current_user: dict = Depends(get_current_user)):    
    try:
        order = PurchaseOrder.from_dict(order_data)

        repository = OrderRepository()

        order_id = repository.save(order)
    
        return {
            "status": "success", 
            "message": "Pedido salvo com sucesso",
            "id_interno": order_id
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
