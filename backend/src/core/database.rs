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

#[cfg(test)]
mod tests {
    use super::*;

    #[tokio::test]
    async fn test_postgres_connection() {
        let pool = init_postgres_pool().await;

        let result = sqlx::query!("SELECT 1 as test_val").fetch_one(&pool).await;

        assert!(
            result.is_ok(),
            "Failed to execute test query on PostgreSQL database: {:?}",
            result.err()
        );
    }
}
