use crate::domain::enums::vehicle_type::VehicleType;
use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub struct Vehicle {
    pub capacity_m3: f64,
    #[serde(rename = "type")]
    pub vehicle_type: VehicleType,
    pub quantity: u32,
}

impl Vehicle {
    pub const fn new(capacity_m3: f64, vehicle_type: VehicleType, quantity: u32) -> Self {
        Self {
            capacity_m3,
            vehicle_type,
            quantity,
        }
    }
}
