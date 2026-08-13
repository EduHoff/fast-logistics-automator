use core::fmt;
use std::str::FromStr;

use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "lowercase")]
pub enum UserRole {
    #[serde(alias = "ADMIN")]
    Admin,
    #[serde(alias = "OPERATOR")]
    Operator,
}

impl fmt::Display for UserRole {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            UserRole::Admin => write!(f, "admin"),
            UserRole::Operator => write!(f, "operator"),
        }
    }
}

impl FromStr for UserRole {
    type Err = String;

    fn from_str(s: &str) -> Result<Self, Self::Err> {
        match s.to_lowercase().trim() {
            "admin" => Ok(UserRole::Admin),
            "operator" => Ok(UserRole::Operator),
            _ => Err(format!("Unknown role: '{s}'")),
        }
    }
}
