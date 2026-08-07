from core.database import get_supabase
from domain.enums.vehicle_type import VehicleType
from domain.enums.category import AssemblyStatus, Category
from domain.enums.unit_type import UnitType
from domain.entities.purchase_order import PurchaseOrder
from infra.repositories.product_repository import ProductRepository

class LogisticsService:
    def __init__(self):
        self.repository = ProductRepository()
        self.db = get_supabase()

    def calculate_total_volume(self, order: PurchaseOrder) -> float:
        descricoes = [item.description.upper() for item in order.items]
        codigos = [item.code for item in order.items]
        
        seca_data, refrig_data = self.repository.get_logistics_data(descricoes, codigos)
        adjustment_factors = self.repository.get_adjustment_factors()

        mapa_seca = {row['nome'].upper(): float(row['qtd_por_m3']) for row in seca_data}
        mapa_fatores = {row['categoria'].upper(): float(row['fator']) for row in adjustment_factors}

        total_volume = 0.0

        for item in order.items:
            volume_item = 0.0
            desc_upper = item.description.upper()

            # --- MÉTODO A: LINHA SECA ---
            if desc_upper in mapa_seca:
                items_per_m3 = mapa_seca[desc_upper]
                
                if items_per_m3 > 0:
                    volume_base = item.quantity / items_per_m3
                    
                    fator_ajuste = mapa_fatores.get(item.category.value.upper(), 1.0)
                    
                    if item.category == Category.PORTA_PALLETS:
                        chave = "DESMONTADO" if item.unit == UnitType.PC else "MONTADO"
                        fator_ajuste = mapa_fatores.get(chave, 1.0)
                    
                    volume_item = volume_base * fator_ajuste

            # --- MÉTODO B: REFRIGERADOS ---
            else:
                dados_refrig = next((r for r in refrig_data if r['codigo_atual'] == item.code or r['codigo_antigo'] == item.code), None)
                if dados_refrig:
                    v_unitario = float(dados_refrig['comprimento']) * float(dados_refrig['largura']) * float(dados_refrig['altura'])
                    volume_item = v_unitario * item.quantity

            total_volume += volume_item

        return round(total_volume, 3)
    

    def calculate_final_quote(self, order: PurchaseOrder) -> PurchaseOrder:
        city_query = self.db.table("cidades").select("*").ilike("nome", order.city.strip()).execute()
        
        if not city_query.data:
            raise ValueError(f"A cidade '{order.city}' não está cadastrada na tabela de fretes base.")
            
        city_data = city_query.data[0]

        BASE_DISCHARGE = 250.0 
        AD_VALOREM = 0.0 
        COMMERCIAL_MARGIN = 1.20
        
        tax_record = self.db.table("regras_impostos").select("aliquota_icms").eq("uf", order.uf.name).single().execute()
        icms = float(tax_record.data.get('aliquota_icms', 18.0))
        
        customer_record = self.db.table("fatores_descarga").select("fator").eq("nome", order.customer_name).execute()
        
        if len(customer_record.data) > 0:
            discharge_factor = float(customer_record.data[0]['fator'])
        else:
            other_record = self.db.table("fatores_descarga").select("fator").eq("nome", "OUTROS").single().execute()
            discharge_factor = float(other_record.data['fator'])

        total_cost = 0.0
        for v in order.vehicles:
            if v.type == VehicleType.CARRETA:
                base = float(city_data['frete_base_carreta'])
                toll = float(city_data['pedagio_carreta'])
            else:
                base = float(city_data['frete_base_truck'])
                toll = float(city_data['pedagio_truck'])
            
            discharge_cost = BASE_DISCHARGE * discharge_factor
            total_cost += (base + toll + discharge_cost + AD_VALOREM) * v.quantity

        subtotal = total_cost * COMMERCIAL_MARGIN
        total_tax_rate = (icms + 9.25) / 100
        
        final_value = subtotal / (1 - total_tax_rate)
        
        order.total_freight = final_value
        return order