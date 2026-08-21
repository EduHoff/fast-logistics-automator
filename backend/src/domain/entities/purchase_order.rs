use crate::domain::entities::{product::Product, vehicle::Vehicle};
use crate::domain::enums::uf::Uf;
use bigdecimal::{BigDecimal, RoundingMode};
use num_traits::{ToPrimitive, Zero};
use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub struct PurchaseOrder {
    pub order_number: String,
    pub customer_name: String,
    pub city: String,
    pub uf: Uf,
    pub created_by_id: String,
    pub total_volume_m3: BigDecimal,
    #[serde(default)]
    pub total_freight: BigDecimal,
    #[serde(default)]
    pub items: Vec<Product>,
    #[serde(default)]
    pub vehicles: Vec<Vehicle>,
}

impl PurchaseOrder {
    pub fn new(
        order_number: String,
        customer_name: String,
        city: String,
        uf: Uf,
        created_by_id: String,
        total_volume_m3: BigDecimal,
        total_freight: &BigDecimal,
    ) -> Self {
        Self {
            order_number,
            customer_name,
            city,
            uf,
            created_by_id,
            total_volume_m3,
            total_freight: total_freight.with_scale_round(2, RoundingMode::HalfUp),
            items: Vec::new(),
            vehicles: Vec::new(),
        }
    }

    pub fn add_item(&mut self, product: Product) {
        self.items.push(product);
    }

    pub fn add_vehicle(&mut self, vehicle: Vehicle) {
        self.vehicles.push(vehicle);
    }

    pub fn total_products_quantity(&self) -> u32 {
        self.items.iter().map(|item| item.quantity).sum()
    }

    pub fn get_linear_meters(&self, capacity_ref: Option<f64>) -> f64 {
        if self.total_volume_m3.is_zero() {
            return 0.0;
        }

        let volume_f64 = self.total_volume_m3.to_f64().unwrap_or(0.0);
        let cap = capacity_ref.unwrap_or(60.0);

        (volume_f64 * 12.0) / cap
    }

    pub fn get_meters_nvia(&self, capacity_ref: Option<f64>) -> f64 {
        let linear = self.get_linear_meters(capacity_ref);
        ((linear * 1.10) * 100.0).round() / 100.0
    }

    pub fn get_meters_venda(&self, capacity_ref: Option<f64>) -> f64 {
        let linear = self.get_linear_meters(capacity_ref);
        ((linear * 1.20) * 100.0).round() / 100.0
    }
}
