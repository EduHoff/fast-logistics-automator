use num_traits::ToPrimitive;
use rocket::State;
use rocket::http::Status;
use rocket::post;
use rocket::serde::json::Json;
use sqlx::PgPool;

use crate::{
    api::guards::AuthenticatedUser,
    domain::{
        entities::{purchase_order::PurchaseOrder, vehicle::Vehicle},
        enums::vehicle_type::VehicleType,
    },
    infra::repositories::order_repository::OrderRepository,
    services::logistics_service::LogisticsService,
};

#[post("/calculate", data = "<order_data>")]
pub async fn calculate_volume(
    pool: &State<PgPool>,
    _user: AuthenticatedUser,
    order_data: Json<PurchaseOrder>,
) -> Result<Json<PurchaseOrder>, (Status, String)> {
    let mut order = order_data.into_inner();
    order.vehicles.clear();

    let service = LogisticsService::new(pool.inner().clone());

    let total_volume = service
        .calculate_total_volume(&order)
        .await
        .map_err(|e| (Status::InternalServerError, e))?;

    order.total_volume_m3 = total_volume;
    let mut remaining_volume = total_volume;

    if remaining_volume >= 60.0 {
        let num_carretas = (remaining_volume / 60.0).floor().to_u32().unwrap_or(0);
        order.add_vehicle(Vehicle::new(60.0, VehicleType::Carreta, num_carretas));
        remaining_volume %= 60.0;
    }
    
    if remaining_volume > 0.0 {
        let num_trucks = (remaining_volume / 45.0).ceil().to_u32().unwrap_or(0);
        order.add_vehicle(Vehicle::new(45.0, VehicleType::Truck, num_trucks));
    }

    Ok(Json(order))
}

#[post("/quote", data = "<quote_request>")]
pub async fn final_quote(
    pool: &State<PgPool>,
    _user: AuthenticatedUser,
    quote_request: Json<PurchaseOrder>,
) -> Result<Json<PurchaseOrder>, (Status, String)> {
    let order = quote_request.into_inner();
    let service = LogisticsService::new(pool.inner().clone());

    // Passa a referência do PgPool e usa .await antes de tratar o erro
    let result = service
        .calculate_final_quote(pool.inner(), order)
        .await
        .map_err(|e| (Status::BadRequest, e))?;

    Ok(Json(result))
}

#[derive(serde::Serialize)]
pub struct SaveOrderResponse {
    pub status: &'static str,
    pub message: &'static str,
    pub internal_id: uuid::Uuid,
}

#[post("/save", data = "<order_data>")]
pub async fn save_order(
    pool: &State<PgPool>,
    _user: AuthenticatedUser,
    order_data: Json<PurchaseOrder>,
) -> Result<Json<SaveOrderResponse>, (Status, String)> {
    let order = order_data.into_inner();
    let repository = OrderRepository::new(pool.inner().clone());

    let order_id = repository
        .save(&order)
        .await
        .map_err(|e| (Status::BadRequest, e.to_string()))?;

    Ok(Json(SaveOrderResponse {
        status: "success",
        message: "Order saved successfully",
        internal_id: order_id,
    }))
}
