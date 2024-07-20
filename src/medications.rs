// medications.rs
// Ojos Project
// 
// This handles a lot of medication-related functions.
pub struct Medication {
    name: String,
    brand: String,
    dosage: f64,
    frequency: Option<String>,
    supply: Option<f64>,
    first_added: Option<f64>,
    last_taken: Option<f64>,
}