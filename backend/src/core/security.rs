use argon2::{
    Argon2,
    password_hash::{PasswordHash, PasswordHasher, PasswordVerifier, SaltString, rand_core::OsRng},
};
use chrono::{Duration, Utc};
use jsonwebtoken::{DecodingKey, EncodingKey, Header, Validation, decode, encode};
use serde::{Deserialize, Serialize};
use std::env;

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Claims {
    pub sub: String,
    pub email: String,
    pub role: String,
    pub exp: i64,
}

pub fn hash_password(password: &str) -> Result<String, String> {
    let salt = SaltString::generate(&mut OsRng);
    let argon2 = Argon2::default();

    argon2
        .hash_password(password.as_bytes(), &salt)
        .map(|hash| hash.to_string())
        .map_err(|err| format!("Failed to hash password: {err}"))
}

pub fn verify_password(provided_password: &str, stored_hash: &str) -> bool {
    let Ok(parsed_hash) = PasswordHash::new(stored_hash) else {
        return false;
    };

    Argon2::default()
        .verify_password(provided_password.as_bytes(), &parsed_hash)
        .is_ok()
}

pub fn create_access_token(user_id: &str, email: &str, role: &str) -> Result<String, String> {
    let secret = env::var("SECRET_TOKEN_KEY")
        .expect("SECRET_TOKEN_KEY must be configured in the environment");

    let expiration = Utc::now()
        .checked_add_signed(Duration::hours(1))
        .expect("Invalid expiration time calculation")
        .timestamp();

    let claims = Claims {
        sub: user_id.to_string(),
        email: email.to_string(),
        role: role.to_string(),
        exp: expiration,
    };

    encode(
        &Header::default(),
        &claims,
        &EncodingKey::from_secret(secret.as_bytes()),
    )
    .map_err(|err| format!("Failed to encode JWT token: {err}"))
}

pub fn decode_access_token(token: &str) -> Result<Claims, String> {
    let secret = env::var("SECRET_TOKEN_KEY")
        .expect("SECRET_TOKEN_KEY must be configured in the environment");

    let validation = Validation::default();

    decode::<Claims>(
        token,
        &DecodingKey::from_secret(secret.as_bytes()),
        &validation,
    )
    .map(|data| data.claims)
    .map_err(|_| "Invalid or expired token".to_string())
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_password_hashing_and_verification() {
        let password = "mysecurepassword123";
        let hash =
            hash_password(password).expect("Password hashing should succeed with valid input");

        assert!(verify_password(password, &hash));
        assert!(!verify_password("wrongpassword", &hash));
    }
}
