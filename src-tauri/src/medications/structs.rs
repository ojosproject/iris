use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize)]
pub struct Medication {
    pub name: String,
    pub brand: Option<String>,
    pub dosage: f64,
    pub frequency: f64,
    pub supply: f64,
    pub total_prescribed: f64,
    pub first_added: f64,
    pub last_taken: Option<f64>,
    pub upcoming_dose: Option<f64>,
    pub schedule: Option<String>,
    pub measurement: String,
    pub nurse_id: String,
}

#[derive(Serialize, Deserialize)]
pub struct MedicationLog {
    pub timestamp: f64,
    pub medication_name: String,
    pub given_dose: f64,
    pub measurement: String,
    pub comment: Option<String>,
}

#[derive(Serialize, Deserialize)]
pub struct Resource {
    pub label: String,
    pub description: String,
    pub url: String,
    pub organization: String,
    pub category: String,
    pub last_updated: f32,
}
