#![allow(dead_code)]
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize)]
pub struct Medication {
    pub name: String,
    pub brand: String,
    pub dosage: f64,
    pub frequency: f64,
    pub supply: Option<f64>,
    pub first_added: Option<f64>,
    pub last_taken: Option<f64>,
    pub upcoming_dose: Option<f64>,
    pub schedule: Option<String>,
    pub measurement: String,
}

#[derive(Serialize, Deserialize)]
pub struct User {
    pub id: String,
    pub full_name: String,
    pub type_of: String,
}

pub struct MedicationLog {
    pub timestamp: f64,
    pub medication_name: String,
    pub given_dose: f64,
    pub comment: Option<String>,
}

#[derive(Serialize, Deserialize)]
pub struct Config {
    pub resources_last_call: i64,
    pub onboarding_completed: bool,
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
