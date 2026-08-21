use crate::domain::enums::{category::Category, unit_type::UnitType};
use bigdecimal::BigDecimal;
use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub struct Product {
    pub code: String,
    pub description: String,
    pub quantity: u32,
    pub unit: UnitType,
    pub category: Category,
    #[serde(default)]
    pub items_per_m3: BigDecimal,
    #[serde(default)]
    pub length: BigDecimal,
    #[serde(default)]
    pub width: BigDecimal,
    #[serde(default)]
    pub height: BigDecimal,
}

impl Product {
    pub const fn new(
        code: String,
        description: String,
        quantity: u32,
        unit: UnitType,
        category: Category,
        items_per_m3: BigDecimal,
        length: BigDecimal,
        width: BigDecimal,
        height: BigDecimal,
    ) -> Self {
        Self {
            code,
            description,
            quantity,
            unit,
            category,
            items_per_m3,
            length,
            width,
            height,
        }
    }
}
