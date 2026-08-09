use crate::domain::enums::{category::Category, unit_type::UnitType};
use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub struct Product {
    pub code: String,
    pub description: String,
    pub quantity: u32,
    pub unit: UnitType,
    pub category: Category,
    #[serde(default)]
    pub items_per_m3: f64,
    #[serde(default)]
    pub length: f64,
    #[serde(default)]
    pub width: f64,
    #[serde(default)]
    pub height: f64,
}

impl Product {
    pub const fn new(
        code: String,
        description: String,
        quantity: u32,
        unit: UnitType,
        category: Category,
        items_per_m3: f64,
        length: f64,
        width: f64,
        height: f64,
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
