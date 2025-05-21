use serde::{Deserialize, Serialize};

// Reminder:
// Ensure SQL's `INTEGER` is set for i64, and `REAL` for f64.
// ONLY USE THOSE VALUES.
#[derive(Serialize, Deserialize)]
pub struct Medication {
    pub id: String,
    pub name: String,
    pub generic_name: Option<String>,
    pub dosage_type: String,
    pub strength: f64,
    pub units: String,
    pub quantity: f64,
    pub created_at: i64,
    pub updated_at: i64,
    pub start_date: Option<i64>,
    pub end_date: Option<i64>,
    pub expiration_date: Option<i64>,
    pub frequency: Option<String>,
    pub notes: Option<String>,
    pub last_taken: Option<i64>,
    pub icon: String,
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

#[derive(Serialize, Deserialize)]
pub struct Schedule {
    pub id: String,
    pub medication_id: String,
    pub dosage: f64,
    pub time: i64
}
