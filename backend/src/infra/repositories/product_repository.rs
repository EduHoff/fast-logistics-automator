use sqlx::{FromRow, PgPool, query_as};

#[derive(Debug, FromRow)]
pub struct DryLineCatalog {
    pub nome: String,
    pub qtd_por_m3: Option<f64>,
    pub categoria: Option<String>,
}

#[derive(Debug, FromRow)]
pub struct RefrigeratedCatalog {
    pub codigo_atual: Option<String>,
    pub codigo_antigo: Option<String>,
    pub comprimento: Option<f64>,
    pub largura: Option<f64>,
    pub altura: Option<f64>,
}

#[derive(Debug, FromRow)]
pub struct AdjustmentFactor {
    pub categoria: String,
    pub fator: f64,
}

pub struct ProductRepository {
    pool: PgPool,
}

impl ProductRepository {
    pub const fn new(pool: PgPool) -> Self {
        Self { pool }
    }

    pub async fn get_logistics_data(
        &self,
        product_descriptions: &[String],
        product_codes: &[String],
    ) -> Result<(Vec<DryLineCatalog>, Vec<RefrigeratedCatalog>), sqlx::Error> {
        let dry_line = query_as::<_, DryLineCatalog>(
            r"
            SELECT nome, qtd_por_m3::float8, categoria
            FROM catalogo_linha_seca
            WHERE nome = ANY($1)
            ",
        )
        .bind(product_descriptions)
        .fetch_all(&self.pool)
        .await?;

        let refrigerated = query_as::<_, RefrigeratedCatalog>(
            r"
            SELECT codigo_atual, codigo_antigo, comprimento::float8, largura::float8, altura::float8
            FROM catalogo_refrigerados
            WHERE codigo_atual = ANY($1) OR codigo_antigo = ANY($1)
            ",
        )
        .bind(product_codes)
        .fetch_all(&self.pool)
        .await?;

        Ok((dry_line, refrigerated))
    }

    pub async fn get_adjustment_factors(&self) -> Result<Vec<AdjustmentFactor>, sqlx::Error> {
        let factors = query_as::<_, AdjustmentFactor>(
            r"
            SELECT categoria, fator::float8
            FROM fatores_reajuste_linha_seca
            ",
        )
        .fetch_all(&self.pool)
        .await?;

        Ok(factors)
    }
}
