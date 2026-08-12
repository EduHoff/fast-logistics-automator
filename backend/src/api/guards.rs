use rocket::http::Status;
use rocket::request::{FromRequest, Outcome, Request};
use uuid::Uuid;

pub struct AuthenticatedUser {
    pub id: Uuid,
    pub email: String,
    pub role: String,
}

#[rocket::async_trait]
impl<'r> FromRequest<'r> for AuthenticatedUser {
    type Error = &'static str;

    async fn from_request(req: &'r Request<'_>) -> Outcome<Self, Self::Error> {
        let auth_header = req.headers().get_one("Authorization");

        match auth_header {
            Some(header) if header.starts_with("Bearer ") => {
                let token = &header[7..];

                match crate::core::security::decode_access_token(token) {
                    Ok(claims) => {
                        let Ok(user_id) = Uuid::parse_str(&claims.sub) else {
                            return Outcome::Error((
                                Status::Unauthorized,
                                "Invalid user ID format in token",
                            ));
                        };

                        Outcome::Success(AuthenticatedUser {
                            id: user_id,
                            email: claims.email,
                            role: claims.role,
                        })
                    }
                    Err(_) => Outcome::Error((Status::Unauthorized, "Invalid or expired token")),
                }
            }
            _ => Outcome::Error((
                Status::Unauthorized,
                "Missing or invalid Authorization header",
            )),
        }
    }
}
