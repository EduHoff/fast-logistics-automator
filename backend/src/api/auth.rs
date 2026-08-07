use rocket::post;

#[post("/register")]
pub const fn register() -> &'static str {
    "Rota de registro chamada! (mock)"
}

#[post("/login")]
pub const fn login() -> &'static str {
    "Rota de login chamada! (mock)"
}
