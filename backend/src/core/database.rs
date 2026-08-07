use dotenvy::dotenv;
use sqlx::{PgPool, postgres::PgPoolOptions};
use std::env;

pub async fn init_postgres_pool() -> PgPool {
    dotenv().ok();

    let database_url =
        env::var("DATABASE_URL").expect("DATABASE_URL needs to be configured in the .env file.");

    PgPoolOptions::new()
        .max_connections(5)
        .connect(&database_url)
        .await
        .expect("Failed to connect to the database")
}
