use rocket::form::{Form, FromForm};
use rocket::fs::TempFile;
use rocket::http::Status;
use rocket::post;
use rocket::serde::json::Json;

use crate::api::guards::AuthenticatedUser;
use crate::domain::entities::purchase_order::PurchaseOrder;
use crate::infra::scanner::json_scanner::JSONScanner;
use crate::infra::scanner::pdf_scanner::PDFScanner;
use crate::infra::scanner::scanner_trait::Scanner;

#[derive(FromForm)]
pub struct UploadData<'r> {
    pub file: TempFile<'r>,
}

#[post("/", data = "<data>")]
pub async fn scan(
    user: AuthenticatedUser,
    data: Form<UploadData<'_>>,
) -> Result<Json<PurchaseOrder>, (Status, String)> {
    let file_name = data
        .file
        .raw_name()
        .and_then(|n| n.as_str())
        .map(ToString::to_string)
        .unwrap_or_default();

    let extension = file_name.split('.').next_back().unwrap_or("").to_lowercase();

    let temp_path = data.file.path().ok_or((
        Status::InternalServerError,
        "Failed to process uploaded file".to_string(),
    ))?;

    let content = tokio::fs::read(temp_path)
        .await
        .map_err(|e| (Status::BadRequest, e.to_string()))?;

    let user_id_str = user.id.to_string();

    let result: PurchaseOrder = match extension.as_str() {
        "pdf" => {
            let scanner = PDFScanner;

            scanner
                .scan(&content, &user_id_str)
                .map_err(|e| (Status::BadRequest, e))?
        }
        "json" => {
            let scanner = JSONScanner;

            scanner
                .scan(&content, &user_id_str)
                .map_err(|e| (Status::BadRequest, e))?
        }
        _ => {
            return Err((
                Status::UnsupportedMediaType,
                format!("Extension .{extension} is not supported. Please upload PDF or JSON."),
            ));
        }
    };

    Ok(Json(result))
}
