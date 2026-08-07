import json
from .scanner_interface import ScannerInterface
from domain.entities.purchase_order import PurchaseOrder
from domain.entities.product import Product
from domain.enums.uf import UF
from domain.enums.unit_type import UnitType
from domain.enums.category import Category

class JSONScanner(ScannerInterface):

    def scan(self, file_content: bytes, created_by_id: str) -> PurchaseOrder:
        data = json.loads(file_content.decode('utf-8'))
        
        uf_abbreviation = data.get("uf", "PR").upper().strip()
        try:
            uf_enum = UF[uf_abbreviation]
        except KeyError:
            uf_enum = UF.PR 
        
        total_volume = float(data.get("total_volume_m3", 0.0))

        order = PurchaseOrder(
            order_number=data.get("order_number", "N/A"),
            customer_name=data.get("customer_name", "Desconhecido"),
            city=data.get("city", "Não informada"),
            uf=uf_enum,
            created_by_id=created_by_id,
            total_volume_m3=total_volume
        )

        for item in data.get("items", []):
            code = item.get("code", "")
            
            prefix = code.split('-')[0].upper()
            match prefix:
                case "LSG": category = Category.LSG
                case "MOB": category = Category.MOBILIAS
                case "CKO" | "CK": category = Category.CHECKOUTS
                case "RS": category = Category.RACK_SLIM
                case "PAL": category = Category.PORTA_PALLETS
                case _: category = Category.REFRIGERATED

            product = Product(
                code=code,
                description=item.get("description", ""),
                quantity=int(item.get("quantity", 0)),
                unit=UnitType(item.get("unit", "PC")),
                category=category,
                length=float(item.get("length", 0.0)),
                width=float(item.get("width", 0.0)),
                height=float(item.get("height", 0.0)),
                items_per_m3=float(item.get("items_per_m3", 0.0))
            )
            order.add_item(product)

        return order