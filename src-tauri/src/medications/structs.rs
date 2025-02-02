use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize)]
pub struct Medication {
    pub id: String,
    pub name: String,
    pub generic_name: Option<String>,
    pub dosage_type: String,
    pub strength: f64,
    pub units: String,
    pub quantity: i64,
    pub created_at: i64,
    pub updated_at: i64,
    pub start_date: Option<i64>,
    pub end_date: Option<i64>,
    pub expiration_date: Option<i64>,
    pub frequency: Option<String>,
    pub notes: Option<String>,
}

#[derive(Serialize, Deserialize)]
pub struct MedicationLog {
    pub id: String,
    pub timestamp: i64,
    pub medication_id: String,
    pub strength: f64,
    pub units: String,
    pub comments: Option<String>,
}
