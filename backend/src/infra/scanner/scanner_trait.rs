use crate::domain::entities::purchase_order::PurchaseOrder;

pub trait Scanner {
    fn scan(&self, file_content: &[u8], created_by_id: &str) -> Result<PurchaseOrder, String>;
}
