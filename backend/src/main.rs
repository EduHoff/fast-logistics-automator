use backend::api;
use dotenvy::{dotenv, from_filename};
use sqlx::postgres::PgPoolOptions;

#[macro_use]
extern crate rocket;

#[launch]
async fn rocket() -> _ {
    if dotenv().is_err() {
        let _ = from_filename("../.env");
    }

    let database_url =
        std::env::var("DATABASE_URL").expect("DATABASE_URL must be set in the .env file");

    let pool = PgPoolOptions::new()
        .max_connections(5)
        .connect(&database_url)
        .await
        .expect("Failed to connect to Postgres database");

    api::build_rocket(pool)
}

//tree . -I "public|node_modules|venv|__pycache__|target"
