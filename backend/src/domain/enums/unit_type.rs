use core::fmt;
use std::str::FromStr;

use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub enum UnitType {
    PC,
    CJ,
}

impl FromStr for UnitType {
    type Err = ();

    fn from_str(s: &str) -> Result<Self, Self::Err> {
        match s.trim().to_uppercase().as_str() {
            "PC" => Ok(UnitType::PC),
            "CJ" => Ok(UnitType::CJ),
            _ => Err(()),
        }
    }
}

impl std::fmt::Display for UnitType {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            UnitType::PC => write!(f, "PC"),
            UnitType::CJ => write!(f, "CJ"),
        }
    }
}
