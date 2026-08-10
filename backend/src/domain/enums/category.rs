use core::fmt;

use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "SCREAMING_SNAKE_CASE")]
pub enum Category {
    Lsg,
    Mobilias,
    RackSlim,
    Checkouts,
    PortaPallets,
    Refrigerated,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "SCREAMING_SNAKE_CASE")]
pub enum AssemblyStatus {
    Montado,
    Desmontado,
}

impl Category {
    pub fn from_code(code: &str) -> Self {
        let prefix = code.split('-').next().unwrap_or("").to_uppercase();
        match prefix.as_str() {
            "LSG" => Category::Lsg,
            "MOB" => Category::Mobilias,
            "CKO" | "CK" => Category::Checkouts,
            "RS" => Category::RackSlim,
            "PAL" => Category::PortaPallets,
            _ => Category::Refrigerated,
        }
    }
}

impl std::fmt::Display for Category {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            Category::Lsg => write!(f, "LSG"),
            Category::Mobilias => write!(f, "MOBILIAS"),
            Category::RackSlim => write!(f, "RACK_SLIM"),
            Category::Checkouts => write!(f, "CHECKOUTS"),
            Category::PortaPallets => write!(f, "PORTA_PALLETS"),
            Category::Refrigerated => write!(f, "REFRIGERATED"),
        }
    }
}
