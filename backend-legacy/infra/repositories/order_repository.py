from core.database import get_supabase
from domain.entities.purchase_order import PurchaseOrder

class OrderRepository:
    def __init__(self):
        self.db = get_supabase()

    def save(self, order: PurchaseOrder) -> str:
        pedido_payload = {
            "usuario_id": order.created_by_id,
            "numero_oc": order.order_number,
            "cliente_nome": order.customer_name,
            "cidade_nome": order.city,
            "uf": order.uf.abbreviation,
            "total_volume_m3": order.total_volume_m3,
            "total_freite_calculado": order.total_freight,
            "status": "confirmado"
        }

        res = self.db.table("pedidos").insert(pedido_payload).execute()
        if not res.data:
            raise Exception("Erro ao persistir cabeçalho do pedido no Supabase")
        
        order_id = res.data[0]["id"]

        itens_payload = [
            {
                "pedido_id": order_id,
                "codigo_produto": item.code,
                "descricao": item.description,
                "quantidade": item.quantity,
                "unidade": item.unit.name,
                "categoria": item.category.value,
                "itens_por_m3": item.items_per_m3,
                "comprimento": item.length,
                "largura": item.width,
                "altura": item.height
            } for item in order.items
        ]

        self.db.table("pedido_itens").insert(itens_payload).execute()
        
        return order_id