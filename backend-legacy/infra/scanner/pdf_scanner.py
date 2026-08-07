import io
import re
from PyPDF2 import PdfReader
from .scanner_interface import ScannerInterface
from domain.entities.purchase_order import PurchaseOrder
from domain.entities.product import Product
from domain.enums.uf import UF
from domain.enums.unit_type import UnitType
from domain.enums.category import Category

class PDFScanner(ScannerInterface):

    def scan(self, file_content: bytes, created_by_id: str) -> PurchaseOrder:
        file_stream = io.BytesIO(file_content)
        reader = PdfReader(file_stream)
        raw_text = ""
        for page in reader.pages:
            raw_text += page.extract_text() + "\n"

        order_match = re.search(r"OC-\d{4}-\d+", raw_text)
        order_num = order_match.group(0) if order_match else "N/A"

        customer_match = re.search(r"Destinatário:\n(.+)", raw_text)
        customer = customer_match.group(1).strip() if customer_match else "Desconhecido"

        city_uf_match = re.search(r"Cidade\s*/\s*UF:\n(.+?)\s*/\s*([A-Z]{2})", raw_text)
        if city_uf_match:
            city = city_uf_match.group(1).strip()
            uf_sigla = city_uf_match.group(2).strip()
            uf_enum = UF[uf_sigla]
        else:
            city, uf_enum = "Não informada", UF.PR

        order: PurchaseOrder = PurchaseOrder(
            order_number=order_num,
            customer_name=customer,
            city=city,
            uf=uf_enum,
            created_by_id=created_by_id,
            total_volume_m3=0.0,
            total_freight=0.0
        )

        item_pattern = re.compile(r"(\d{2})\n([A-Z]{3}-\d{3})\n(.+?)\n\s*(\d+(?:\.?\d*))\n\s*([A-Z]{2})")

        for match in item_pattern.finditer(raw_text):
            _, code, desc, qty_str, unit_str = match.groups()
            
            quantity = int(qty_str.replace('.', ''))
            
            prefix = code.split('-')[0].upper()
            match prefix:
                case "LSG":
                    category = Category.LSG
                case "MOB":
                    category = Category.MOBILIAS
                case "CKO" | "CK":
                    category = Category.CHECKOUTS
                case "RS":
                    category = Category.RACK_SLIM
                case "PAL":
                    category = Category.PORTA_PALLETS
                case _:
                    category = Category.REFRIGERATED

            product = Product(
                code=code,
                description=desc.strip(),
                quantity=quantity,
                unit=UnitType(unit_str.strip()),
                category=category
            )
            order.add_item(product)

        return order