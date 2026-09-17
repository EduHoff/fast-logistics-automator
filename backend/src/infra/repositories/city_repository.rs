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
}

#[derive(Debug, Clone)]
pub struct CityTariffRecord {
    pub cidade_id: Uuid,
    pub tipo_veiculo: String,
    pub frete_base: Option<BigDecimal>,
    pub pedagio: Option<BigDecimal>,
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
            SELECT id, uf, nome, distancia_km
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
                }))
            }
            None => Ok(None),
        }
    }

    pub async fn find_tariffs_by_city_id(
        &self,
        cidade_id: Uuid,
    ) -> Result<Vec<CityTariffRecord>, String> {
        let rows = sqlx::query!(
            r#"
            SELECT cidade_id, tipo_veiculo, frete_base, pedagio
            FROM cidade_tarifas
            WHERE cidade_id = $1
            "#,
            cidade_id
        )
        .fetch_all(&self.pool)
        .await
        .map_err(|e| e.to_string())?;

        Ok(rows
            .into_iter()
            .map(|r| CityTariffRecord {
                cidade_id: r.cidade_id,
                tipo_veiculo: r.tipo_veiculo,
                frete_base: r.frete_base,
                pedagio: r.pedagio,
            })
            .collect())
    }

    pub async fn insert(
        &self,
        uf: Uf,
        nome: &str,
        distancia_km: i32,
    ) -> Result<CityRecord, String> {
        let uf_str = uf.to_string();

        let row = sqlx::query!(
            r#"
            INSERT INTO cidades (uf, nome, distancia_km)
            VALUES ($1, $2, $3)
            RETURNING id, uf, nome, distancia_km
            "#,
            uf_str,
            nome,
            distancia_km
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
        })
    }

    pub async fn insert_tariff(
        &self,
        cidade_id: Uuid,
        tipo_veiculo: &str,
        frete_base: &BigDecimal,
        pedagio: &BigDecimal,
    ) -> Result<CityTariffRecord, String> {
        let row = sqlx::query!(
            r#"
            INSERT INTO cidade_tarifas (cidade_id, tipo_veiculo, frete_base, pedagio)
            VALUES ($1, $2, $3, $4)
            RETURNING cidade_id, tipo_veiculo, frete_base, pedagio
            "#,
            cidade_id,
            tipo_veiculo,
            frete_base,
            pedagio
        )
        .fetch_one(&self.pool)
        .await
        .map_err(|e| e.to_string())?;

        Ok(CityTariffRecord {
            cidade_id: row.cidade_id,
            tipo_veiculo: row.tipo_veiculo,
            frete_base: row.frete_base,
            pedagio: row.pedagio,
        })
    }
}
