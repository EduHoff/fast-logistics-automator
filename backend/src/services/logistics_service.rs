use crate::domain::entities::purchase_order::PurchaseOrder;
use crate::domain::enums::category::Category;
use crate::domain::enums::unit_type::UnitType;
use crate::domain::enums::vehicle_type::VehicleType;
use crate::infra::repositories::product_repository::ProductRepository;
use sqlx::{PgPool, Row};
use std::collections::HashMap;

pub struct LogisticsService {
    product_repo: ProductRepository,
}

impl LogisticsService {
    pub const fn new(pool: PgPool) -> Self {
        Self {
            product_repo: ProductRepository::new(pool),
        }
    }

    pub async fn calculate_total_volume(&self, order: &PurchaseOrder) -> Result<f64, String> {
        let descricoes: Vec<String> = order
            .items
            .iter()
            .map(|i| i.description.to_uppercase())
            .collect();
        let codigos: Vec<String> = order.items.iter().map(|i| i.code.clone()).collect();

        let (seca_data, refrig_data) = self
            .product_repo
            .get_logistics_data(&descricoes, &codigos)
            .await
            .map_err(|e| e.to_string())?;

        let adjustment_factors = self
            .product_repo
            .get_adjustment_factors()
            .await
            .map_err(|e| e.to_string())?;

        let mapa_seca: HashMap<String, f64> = seca_data
            .into_iter()
            .map(|item| (item.nome.to_uppercase(), item.qtd_por_m3.unwrap_or(0.0)))
            .collect();

        let mapa_fatores: HashMap<String, f64> = adjustment_factors
            .into_iter()
            .map(|item| (item.categoria.to_uppercase(), item.fator))
            .collect();

        let mut total_volume: f64 = 0.0;

        for item in &order.items {
            let mut volume_item = 0.0;
            let desc_upper = item.description.to_uppercase();

            if let Some(&items_per_m3) = mapa_seca.get(&desc_upper) {
                if items_per_m3 > 0.0 {
                    let volume_base = f64::from(item.quantity) / items_per_m3;

                    let mut fator_ajuste = *mapa_fatores
                        .get(&item.category.to_string().to_uppercase())
                        .unwrap_or(&1.0);

                    if item.category == Category::PortaPallets {
                        let chave = if item.unit == UnitType::PC {
                            "DESMONTADO"
                        } else {
                            "MONTADO"
                        };
                        fator_ajuste = *mapa_fatores.get(chave).unwrap_or(&1.0);
                    }

                    volume_item = volume_base * fator_ajuste;
                }
            } else if let Some(dados_refrig) = refrig_data.iter().find(|r| {
                r.codigo_atual.as_ref() == Some(&item.code)
                    || r.codigo_antigo.as_ref() == Some(&item.code)
            }) {
                let comp = dados_refrig.comprimento.unwrap_or(0.0);
                let larg = dados_refrig.largura.unwrap_or(0.0);
                let alt = dados_refrig.altura.unwrap_or(0.0);

                let v_unitario = comp * larg * alt;
                volume_item = v_unitario * f64::from(item.quantity);
            }

            total_volume += volume_item;
        }

        let rounded_volume = (total_volume * 1000.0).round() / 1000.0;
        Ok(rounded_volume)
    }

    pub async fn calculate_final_quote(
        &self,
        pool: &PgPool,
        mut order: PurchaseOrder,
    ) -> Result<PurchaseOrder, String> {
        let city_row = sqlx::query(
            "SELECT frete_base_carreta, pedagio_carreta, frete_base_truck, pedagio_truck FROM cidades WHERE nome ILIKE $1 LIMIT 1",
        )
        .bind(order.city.trim())
        .fetch_optional(pool)
        .await
        .map_err(|e| e.to_string())?
        .ok_or_else(|| format!("A cidade '{}' não está cadastrada na tabela de fretes base.", order.city))?;

        let frete_base_carreta: f64 = city_row.get("frete_base_carreta");
        let pedagio_carreta: f64 = city_row.get("pedagio_carreta");
        let frete_base_truck: f64 = city_row.get("frete_base_truck");
        let pedagio_truck: f64 = city_row.get("pedagio_truck");

        let base_discharge = 250.0;
        let ad_valorem = 0.0;
        let commercial_margin = 1.20;

        let icms_row =
            sqlx::query("SELECT aliquota_icms FROM regras_impostos WHERE uf = $1 LIMIT 1")
                .bind(order.uf.to_string())
                .fetch_optional(pool)
                .await
                .map_err(|e| e.to_string())?;

        let icms: f64 = icms_row.map_or(18.0, |r| r.get::<f64, _>("aliquota_icms"));

        let customer_row =
            sqlx::query("SELECT fator FROM fatores_descarga WHERE nome = $1 LIMIT 1")
                .bind(&order.customer_name)
                .fetch_optional(pool)
                .await
                .map_err(|e| e.to_string())?;

        let discharge_factor: f64 = if let Some(r) = customer_row {
            r.get("fator")
        } else {
            let other_row =
                sqlx::query("SELECT fator FROM fatores_descarga WHERE nome = 'OUTROS' LIMIT 1")
                    .fetch_one(pool)
                    .await
                    .map_err(|e| e.to_string())?;
            other_row.get("fator")
        };

        let mut total_cost = 0.0;
        for v in &order.vehicles {
            let (base, toll) = if v.vehicle_type == VehicleType::Carreta {
                (frete_base_carreta, pedagio_carreta)
            } else {
                (frete_base_truck, pedagio_truck)
            };

            let discharge_cost = base_discharge * discharge_factor;
            total_cost += (base + toll + discharge_cost + ad_valorem) * f64::from(v.quantity);
        }

        let subtotal = total_cost * commercial_margin;
        let total_tax_rate = (icms + 9.25) / 100.0;
        let final_value = subtotal / (1.0 - total_tax_rate);

        order.total_freight = final_value;
        Ok(order)
    }
}
