use rocket::post;

#[post("/")]
pub const fn scan() -> &'static str {
    "Rota de scanner chamada! (mock de upload de arquivo)"
}
