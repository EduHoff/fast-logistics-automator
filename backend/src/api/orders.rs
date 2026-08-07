use rocket::post;

#[post("/calculate")]
pub const fn calculate_volume() -> &'static str {
    "Cálculo de volume (mock)"
}

#[post("/quote")]
pub const fn final_quote() -> &'static str {
    "Cotação final do pedido (mock)"
}

#[post("/save")]
pub const fn save_order() -> &'static str {
    "Salvar pedido (mock)"
}
