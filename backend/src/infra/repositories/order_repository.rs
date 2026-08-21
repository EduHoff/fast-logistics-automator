use sqlx::{PgPool, Postgres, Transaction, query, query_scalar};
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

        let uf_str = order.uf.to_string();
        let status = "confirmado";

        let order_id = query_scalar!(
            r#"
            INSERT INTO pedidos (
                usuario_id, numero_oc, cliente_nome, cidade_nome, uf,
                total_volume_m3, total_freite_calculado, status
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING id
            "#,
            created_by_uuid,
            order.order_number,
            order.customer_name,
            order.city,
            uf_str,
            order.total_volume_m3,
            order.total_freight,
            status
        )
        .fetch_one(&mut *tx)
        .await?;

        for item in &order.items {
            let quantity = i32::try_from(item.quantity).unwrap_or(i32::MAX);
            let unit_str = item.unit.to_string();
            let category_str = item.category.to_string();

            query!(
                r#"
                INSERT INTO pedido_itens (
                    pedido_id, codigo_produto, descricao, quantidade,
                    unidade, categoria, itens_por_m3, comprimento, largura, altura
                )
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
                "#,
                order_id,
                item.code,
                item.description,
                quantity,
                unit_str,
                category_str,
                item.items_per_m3,
                item.length,
                item.width,
                item.height
            )
            .execute(&mut *tx)
            .await?;
        }

        tx.commit().await?;
        Ok(order_id)
    }
}
