use crate::domain::enums::uf::Uf;
use bigdecimal::BigDecimal;
use sqlx::PgPool;
use std::str::FromStr;
use uuid::Uuid;

#[derive(Debug, Clone)]
pub struct CityRecord {
    pub id: Uuid,
    pub uf: Uf,
    pub nome: String,
    pub distancia_km: i32,
    pub frete_base_truck: Option<BigDecimal>,
    pub pedagio_truck: Option<BigDecimal>,
    pub frete_base_carreta: Option<BigDecimal>,
    pub pedagio_carreta: Option<BigDecimal>,
}

pub struct CityRepository {
    pool: PgPool,
}

impl CityRepository {
    pub const fn new(pool: PgPool) -> Self {
        Self { pool }
    }

    pub async fn find_by_name_and_uf(
        &self,
        city_name: &str,
        uf: Uf,
    ) -> Result<Option<CityRecord>, String> {
        let uf_str = uf.to_string();

        let row = sqlx::query!(
            r#"
            SELECT
                id,
                uf,
                nome,
                distancia_km,
                frete_base_truck,
                pedagio_truck,
                frete_base_carreta,
                pedagio_carreta
            FROM cidades
            WHERE LOWER(nome) = LOWER($1) AND UPPER(uf) = UPPER($2)
            LIMIT 1
            "#,
            city_name.trim(),
            uf_str
        )
        .fetch_optional(&self.pool)
        .await
        .map_err(|e| e.to_string())?;

        match row {
            Some(r) => {
                let parsed_uf = Uf::from_str(&r.uf)
                    .map_err(|()| format!("UF inválida encontrada no banco: {}", r.uf))?;

                Ok(Some(CityRecord {
                    id: r.id,
                    uf: parsed_uf,
                    nome: r.nome,
                    distancia_km: r.distancia_km,
                    frete_base_truck: r.frete_base_truck,
                    pedagio_truck: r.pedagio_truck,
                    frete_base_carreta: r.frete_base_carreta,
                    pedagio_carreta: r.pedagio_carreta,
                }))
            }
            None => Ok(None),
        }
    }

    pub async fn insert(
        &self,
        uf: Uf,
        nome: &str,
        distancia_km: i32,
        frete_base_truck: &BigDecimal,
        pedagio_truck: &BigDecimal,
        frete_base_carreta: &BigDecimal,
        pedagio_carreta: &BigDecimal,
    ) -> Result<CityRecord, String> {
        let uf_str = uf.to_string();

        let row = sqlx::query!(
            r#"
            INSERT INTO cidades (
                uf, nome, distancia_km,
                frete_base_truck, pedagio_truck,
                frete_base_carreta, pedagio_carreta
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING
                id, uf, nome, distancia_km,
                frete_base_truck, pedagio_truck,
                frete_base_carreta, pedagio_carreta
            "#,
            uf_str,
            nome,
            distancia_km,
            frete_base_truck,
            pedagio_truck,
            frete_base_carreta,
            pedagio_carreta
        )
        .fetch_one(&self.pool)
        .await
        .map_err(|e| e.to_string())?;

        let parsed_uf =
            Uf::from_str(&row.uf).map_err(|()| format!("UF inválida ao inserir: {}", row.uf))?;

        Ok(CityRecord {
            id: row.id,
            uf: parsed_uf,
            nome: row.nome,
            distancia_km: row.distancia_km,
            frete_base_truck: row.frete_base_truck,
            pedagio_truck: row.pedagio_truck,
            frete_base_carreta: row.frete_base_carreta,
            pedagio_carreta: row.pedagio_carreta,
        })
    }
}
