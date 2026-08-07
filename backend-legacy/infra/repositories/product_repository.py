from core.database import get_supabase

class ProductRepository:
    def __init__(self):
        self.db = get_supabase()

    def get_logistics_data(self, product_descriptions: list[str], product_codes: list[str]):
        seca = self.db.table("catalogo_linha_seca") \
            .select("nome, qtd_por_m3, categoria") \
            .in_("nome", product_descriptions) \
            .execute()
        
        codigos_formatados = f"({','.join(product_codes)})"
        filtro_or = f"codigo_atual.in.{codigos_formatados},codigo_antigo.in.{codigos_formatados}"
        
        refrig = self.db.table("catalogo_refrigerados") \
            .select("codigo_atual, codigo_antigo, comprimento, largura, altura") \
            .or_(filtro_or) \
            .execute()

        return seca.data, refrig.data

    def get_adjustment_factors(self):
        res = self.db.table("fatores_reajuste_linha_seca") \
            .select("categoria, fator") \
            .execute()
        return res.data