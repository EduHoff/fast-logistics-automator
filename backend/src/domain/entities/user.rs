use crate::domain::enums::user_role::UserRole;
use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub struct User {
    pub name: String,
    pub email: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub password: Option<String>,
    pub role: UserRole,
}

impl User {
    pub const fn new(name: String, email: String, password: String, role: UserRole) -> Self {
        Self {
            name,
            email,
            password: Some(password),
            role,
        }
    }

    pub fn is_admin(&self) -> bool {
        self.role == UserRole::Admin
    }
}
