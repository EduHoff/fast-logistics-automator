use rocket::State;
use rocket::http::Status;
use rocket::post;
use rocket::serde::json::Json;
use serde::{Deserialize, Serialize};
use sqlx::PgPool;

use crate::{
    core::security::{create_access_token, verify_password},
    domain::{entities::user::User, enums::user_role::UserRole},
    services::user_service::UserService,
};

#[derive(Deserialize)]
pub struct UserSchema {
    pub name: String,
    pub email: String,
    pub password: String,
    pub role: UserRole,
}

#[derive(Deserialize)]
pub struct LoginSchema {
    pub email: String,
    pub password: String,
}

#[derive(Serialize)]
pub struct LoginResponse {
    pub user: User,
    pub access_token: String,
    pub token_type: &'static str,
}

#[post("/register", data = "<data>")]
pub async fn register(
    pool: &State<PgPool>,
    data: Json<UserSchema>,
) -> Result<Json<User>, (Status, String)> {
    let user_service = UserService::new(pool.inner().clone());

    let user = user_service
        .create_user(&data.name, &data.email, &data.password, data.role.clone())
        .await
        .map_err(|e| (Status::BadRequest, e))?;

    Ok(Json(user))
}

#[post("/login", data = "<credentials>")]
pub async fn login(
    pool: &State<PgPool>,
    credentials: Json<LoginSchema>,
) -> Result<Json<LoginResponse>, (Status, String)> {
    let user_service = UserService::new(pool.inner().clone());

    let email = credentials.email.trim();
    let password = credentials.password.trim();

    let user = user_service
        .get_by_email(email)
        .await
        .map_err(|_| {
            (
                Status::Unauthorized,
                "Invalid email or password".to_string(),
            )
        })?
        .ok_or((
            Status::Unauthorized,
            "Invalid email or password".to_string(),
        ))?;

    let stored_hash = user.password.as_deref().ok_or((
        Status::Unauthorized,
        "Invalid email or password".to_string(),
    ))?;

    let is_valid = verify_password(password, stored_hash);

    if !is_valid {
        return Err((
            Status::Unauthorized,
            "Invalid email or password".to_string(),
        ));
    }

    let role_str = format!("{:?}", user.role);

    let token = create_access_token(&user.name, &user.email, &role_str)
        .map_err(|e| (Status::InternalServerError, e))?;

    user_service
        .update_last_login(&user.id.to_string())
        .await
        .map_err(|e| (Status::InternalServerError, e))?;

    Ok(Json(LoginResponse {
        user,
        access_token: token,
        token_type: "bearer",
    }))
}
