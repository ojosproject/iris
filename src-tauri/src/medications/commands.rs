use super::structs::Medication;
use crate::core;
use tauri::AppHandle;

#[tauri::command(rename_all = "snake_case")]
pub fn get_medications(app: AppHandle) -> Vec<Medication> {
    core::user::get_patient(app.clone()).get_medications(app)
}

#[tauri::command(rename_all = "snake_case")]
pub fn get_upcoming_medications(app: AppHandle) -> Vec<Medication> {
    core::user::get_patient(app.clone()).get_upcoming_medications(app)
}

#[tauri::command(rename_all = "snake_case")]
pub fn create_medication(
    app: AppHandle,
    name: String,
    brand: String,
    dosage: f64,
    frequency: f64,
    supply: f64,
    measurement: String,
    nurse_id: String,
) -> Medication {
    Medication::create(
        app,
        &name,
        &brand,
        dosage,
        frequency,
        supply,
        &measurement,
        &nurse_id,
    )
}
