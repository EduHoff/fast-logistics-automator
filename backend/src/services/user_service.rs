use crate::domain::enums::user_role::UserRole;
use crate::{core::security::hash_password, domain::entities::user::User};
use sqlx::{PgPool, Row};
use uuid::Uuid;

pub struct UserService {
    pool: PgPool,
}

impl UserService {
    pub const fn new(pool: PgPool) -> Self {
        Self { pool }
    }

    pub async fn create_user(
        &self,
        name: &str,
        email: &str,
        raw_pwd: &str,
        role: UserRole,
    ) -> Result<User, String> {
        let hashed_password = hash_password(raw_pwd)?;
        let role_str = role.to_string();
        let user_id = Uuid::new_v4();

        sqlx::query(
            "INSERT INTO usuarios (id, nome, email, senha_hash, role) VALUES ($1, $2, $3, $4, $5)",
        )
        .bind(user_id)
        .bind(name)
        .bind(email)
        .bind(&hashed_password)
        .bind(&role_str)
        .execute(&self.pool)
        .await
        .map_err(|e| format!("Erro ao inserir usuário: {e}"))?;

        Ok(User {
            id: user_id,
            name: name.to_string(),
            email: email.to_string(),
            password: Some(hashed_password),
            role,
        })
    }

    pub async fn get_by_email(&self, email: &str) -> Result<Option<User>, String> {
        let row = sqlx::query(
            "SELECT id, nome, email, senha_hash, role FROM usuarios WHERE email = $1 LIMIT 1",
        )
        .bind(email)
        .fetch_optional(&self.pool)
        .await
        .map_err(|e| e.to_string())?;

        if let Some(r) = row {
            let role = r.get::<&str, _>("role").parse::<UserRole>()?;
            let hash: String = r.get("senha_hash");
            let id: Uuid = r.get("id");

            Ok(Some(User {
                id,
                name: r.get("nome"),
                email: r.get("email"),
                password: Some(hash),
                role,
            }))
        } else {
            Ok(None)
        }
    }

    pub async fn update_last_login(&self, user_id: &str) -> Result<(), String> {
        let uuid = Uuid::parse_str(user_id).map_err(|_| "UUID inválido".to_string())?;
        sqlx::query("UPDATE usuarios SET last_login = NOW() WHERE id = $1")
            .bind(uuid)
            .execute(&self.pool)
            .await
            .map_err(|e| e.to_string())?;

        Ok(())
    }
}
