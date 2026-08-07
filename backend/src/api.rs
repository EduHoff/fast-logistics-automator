use rocket::{Build, Rocket, routes};

pub mod auth;
pub mod orders;
pub mod scanner;

pub fn build_rocket() -> Rocket<Build> {
    rocket::build()
        .mount("/", routes![auth::register, auth::login])
        .mount("/scan", routes![scanner::scan])
        .mount(
            "/orders",
            routes![
                orders::calculate_volume,
                orders::final_quote,
                orders::save_order
            ],
        )
}
