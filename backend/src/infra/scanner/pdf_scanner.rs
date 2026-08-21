use bigdecimal::BigDecimal;
use num_traits::Zero;
use regex::Regex;
use std::str::FromStr;

use super::scanner_trait::Scanner;
use crate::domain::entities::{product::Product, purchase_order::PurchaseOrder};
use crate::domain::enums::{category::Category, uf::Uf, unit_type::UnitType};

pub struct PDFScanner;

impl Scanner for PDFScanner {
    fn scan(&self, file_content: &[u8], created_by_id: &str) -> Result<PurchaseOrder, String> {
        let raw_text = pdf_extract::extract_text_from_mem(file_content)
            .map_err(|err| format!("Failed to extract PDF text: {err}"))?;

        let order_re = Regex::new(r"OC-\d{4}-\d+").map_err(|e| e.to_string())?;
        let order_num = order_re
            .find(&raw_text)
            .map_or_else(|| "N/A".to_string(), |m| m.as_str().to_string());

        let customer_re = Regex::new(r"(?i)Destinatário:\s*([^\r\n]+(?:\r?\n[^\r\n]+)?)")
            .map_err(|e| e.to_string())?;

        let customer = if let Some(caps) = customer_re.captures(&raw_text) {
            let full_match = caps.get(1).map_or("", |m| m.as_str());

            let clean_line = full_match
                .lines()
                .take_while(|line| !line.to_lowercase().contains("endereço:"))
                .collect::<Vec<&str>>()
                .join(" ");

            clean_line
                .split_whitespace()
                .collect::<Vec<&str>>()
                .join(" ")
        } else {
            let fallback_re =
                Regex::new(r"(?m)^(SUPERMERCADOS\s+[A-Z\s]+LTDA\.)").map_err(|e| e.to_string())?;

            fallback_re
                .captures(&raw_text)
                .and_then(|caps| caps.get(1))
                .map_or_else(
                    || "Desconhecido".to_string(),
                    |m| m.as_str().trim().to_string(),
                )
        };

        let city_uf_re = Regex::new(r"(?i)Cidade\s*/\s*UF:\s*(.+?)\s*/\s*([A-Z]{2})")
            .map_err(|e| e.to_string())?;

        let (city, uf_enum) = if let Some(caps) = city_uf_re.captures(&raw_text) {
            let city_str = caps.get(1).map_or("Não informada", |m| m.as_str().trim());
            let uf_str = caps.get(2).map_or("PR", |m| m.as_str().trim());
            let parsed_uf = Uf::from_str(uf_str).unwrap_or(Uf::PR);
            (city_str.to_string(), parsed_uf)
        } else {
            ("Não informada".to_string(), Uf::PR)
        };

        let mut order = PurchaseOrder::new(
            order_num,
            customer,
            city,
            uf_enum,
            created_by_id.to_string(),
            BigDecimal::zero(),
            &BigDecimal::zero(),
        );

        let item_pattern =
            Regex::new(r"(?m)^(\d{2})\s+([A-Z]{3}-\d{3})\s+(.+?)\s+(\d+(?:\.\d+)?)\s+([A-Z]{2})$")
                .map_err(|e| e.to_string())?;

        for caps in item_pattern.captures_iter(&raw_text) {
            let code = caps.get(2).map_or("", |m| m.as_str());
            let desc = caps.get(3).map_or("", |m| m.as_str().trim());

            let qty_str = caps
                .get(4)
                .map_or("0".to_string(), |m| m.as_str().replace('.', ""));
            let unit_str = caps.get(5).map_or("PC", |m| m.as_str().trim());

            let quantity = qty_str.parse::<u32>().unwrap_or(0);
            let category = Category::from_code(code);
            let unit = UnitType::from_str(unit_str).unwrap_or(UnitType::PC);

            let product = Product {
                code: code.to_string(),
                description: desc.to_string(),
                quantity,
                unit,
                category,
                length: BigDecimal::zero(),
                width: BigDecimal::zero(),
                height: BigDecimal::zero(),
                items_per_m3: BigDecimal::zero(),
            };

            order.add_item(product);
        }

        Ok(order)
    }
}
