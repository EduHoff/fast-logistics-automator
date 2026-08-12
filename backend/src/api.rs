use rocket::{
    Build, Request, Response, Rocket,
    fairing::{Fairing, Info, Kind},
    http::Header,
    options, routes,
};
use sqlx::PgPool;

pub mod auth;
pub mod guards;
pub mod orders;
pub mod scanner;

#[options("/<_..>")]
pub const fn all_options() {}

pub struct Cors;

#[rocket::async_trait]
impl Fairing for Cors {
    fn info(&self) -> Info {
        Info {
            name: "Add CORS headers to responses",
            kind: Kind::Response,
        }
    }

    async fn on_response<'r>(&self, _request: &'r Request<'_>, response: &mut Response<'r>) {
        response.set_header(Header::new("Access-Control-Allow-Origin", "*"));
        response.set_header(Header::new(
            "Access-Control-Allow-Methods",
            "POST, GET, PATCH, OPTIONS, DELETE",
        ));
        response.set_header(Header::new("Access-Control-Allow-Headers", "*"));
        response.set_header(Header::new("Access-Control-Allow-Credentials", "true"));
    }
}

pub fn build_rocket(pool: PgPool) -> Rocket<Build> {
    rocket::build()
        .attach(Cors)
        .manage(pool)
        .mount("/", routes![auth::register, auth::login, all_options])
        .mount("/scan", routes![scanner::scan])
        .mount(
            "/orders",
            routes![
                orders::calculate_volume,
                orders::final_quote,
                orders::save_order,
            ],
        )
}
