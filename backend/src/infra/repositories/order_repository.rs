use sqlx::{PgPool, Postgres, Row, Transaction};
use uuid::Uuid;

use crate::domain::entities::purchase_order::PurchaseOrder;

pub struct OrderRepository {
    pool: PgPool,
}

impl OrderRepository {
    pub const fn new(pool: PgPool) -> Self {
        Self { pool }
    }

    pub async fn save(&self, order: &PurchaseOrder) -> Result<Uuid, sqlx::Error> {
        let mut tx: Transaction<'_, Postgres> = self.pool.begin().await?;

        let created_by_uuid =
            Uuid::parse_str(&order.created_by_id).map_err(|e| sqlx::Error::Decode(Box::new(e)))?;

        let row = sqlx::query(
            r"
            INSERT INTO pedidos (
                usuario_id, numero_oc, cliente_nome, cidade_nome, uf,
                total_volume_m3, total_freite_calculado, status
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING id
            ",
        )
        .bind(created_by_uuid)
        .bind(&order.order_number)
        .bind(&order.customer_name)
        .bind(&order.city)
        .bind(order.uf.to_string())
        .bind(order.total_volume_m3)
        .bind(order.total_freight)
        .bind("confirmado")
        .fetch_one(&mut *tx)
        .await?;

        let order_id: Uuid = row.get("id");

        for item in &order.items {
            sqlx::query(
                r"
                INSERT INTO pedido_itens (
                    pedido_id, codigo_produto, descricao, quantidade,
                    unidade, categoria, itens_por_m3, comprimento, largura, altura
                )
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
                ",
            )
            .bind(order_id)
            .bind(&item.code)
            .bind(&item.description)
            .bind(i32::try_from(item.quantity).unwrap_or(i32::MAX))
            .bind(item.unit.to_string())
            .bind(item.category.to_string())
            .bind(item.items_per_m3)
            .bind(item.length)
            .bind(item.width)
            .bind(item.height)
            .execute(&mut *tx)
            .await?;
        }

        tx.commit().await?;
        Ok(order_id)
    }
}
