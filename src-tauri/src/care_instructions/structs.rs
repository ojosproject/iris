use serde::{Deserialize, Serialize};

/// # `CareInstruction` struct
///
///  Extra care instructions provided by the caregivers for the nurses.
#[derive(Serialize, Deserialize)]
pub struct CareInstruction {
    pub id: String,
    pub title: String,
    pub content: String,
    pub frequency: Option<String>,
    pub added_by: String,
    pub last_updated: i64,
}
