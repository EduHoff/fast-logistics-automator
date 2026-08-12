use rocket::{Build, Rocket, routes};
use sqlx::PgPool;

pub mod auth;
pub mod guards;
pub mod orders;
pub mod scanner;

pub fn build_rocket(pool: PgPool) -> Rocket<Build> {
    rocket::build()
        .manage(pool)
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
