// medications.rs
// Ojos Project
// 
// This handles a lot of medication-related functions.
#![allow(dead_code)] // ! Remove after we start working in `main.rs`
pub struct Medication {
    pub name: String,
    pub brand: String,
    pub dosage: f64,
    pub frequency: Option<String>,
    pub supply: Option<f64>,
    pub first_added: Option<f64>,
    pub last_taken: Option<f64>,
}