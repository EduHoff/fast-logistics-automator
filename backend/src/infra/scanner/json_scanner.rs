use bigdecimal::BigDecimal;
use num_traits::Zero;
use serde::Deserialize;
use std::str::FromStr;

use super::scanner_trait::Scanner;
use crate::domain::entities::{product::Product, purchase_order::PurchaseOrder};
use crate::domain::enums::{category::Category, uf::Uf, unit_type::UnitType};

#[derive(Deserialize)]
struct RawJsonItem {
    code: Option<String>,
    description: Option<String>,
    quantity: Option<i64>,
    unit: Option<String>,
    length: Option<BigDecimal>,
    width: Option<BigDecimal>,
    height: Option<BigDecimal>,
    items_per_m3: Option<BigDecimal>,
}

#[derive(Deserialize)]
struct RawJsonOrder {
    order_number: Option<String>,
    customer_name: Option<String>,
    city: Option<String>,
    uf: Option<String>,
    total_volume_m3: Option<BigDecimal>,
    items: Option<Vec<RawJsonItem>>,
}

pub struct JSONScanner;

impl Scanner for JSONScanner {
    fn scan(&self, file_content: &[u8], created_by_id: &str) -> Result<PurchaseOrder, String> {
        let raw_order: RawJsonOrder = serde_json::from_slice(file_content)
            .map_err(|err| format!("Failed to parse JSON content: {err}"))?;

        let uf_enum = raw_order
            .uf
            .as_deref()
            .and_then(|sigla| Uf::from_str(sigla.trim()).ok())
            .unwrap_or(Uf::PR);

        let mut order = PurchaseOrder::new(
            raw_order.order_number.unwrap_or_else(|| "N/A".to_string()),
            raw_order
                .customer_name
                .unwrap_or_else(|| "Desconhecido".to_string()),
            raw_order
                .city
                .unwrap_or_else(|| "Não informada".to_string()),
            uf_enum,
            created_by_id.to_string(),
            raw_order.total_volume_m3.unwrap_or_else(BigDecimal::zero),
            &BigDecimal::zero(),
        );

        if let Some(items) = raw_order.items {
            for item in items {
                let code = item.code.unwrap_or_default();
                let category = Category::from_code(&code);

                let unit = item
                    .unit
                    .as_deref()
                    .and_then(|u| UnitType::from_str(u).ok())
                    .unwrap_or(UnitType::PC);

                let quantity = item
                    .quantity
                    .and_then(|q| u32::try_from(q).ok())
                    .unwrap_or(0);

                let product = Product {
                    code,
                    description: item.description.unwrap_or_default(),
                    quantity,
                    unit,
                    category,
                    length: item.length.unwrap_or_else(BigDecimal::zero),
                    width: item.width.unwrap_or_else(BigDecimal::zero),
                    height: item.height.unwrap_or_else(BigDecimal::zero),
                    items_per_m3: item.items_per_m3.unwrap_or_else(BigDecimal::zero),
                };

                order.add_item(product);
            }
        }

        Ok(order)
    }
}
