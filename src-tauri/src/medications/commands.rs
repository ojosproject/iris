use super::structs::{Medication, MedicationLog};
use crate::core::{self, user::get_patient};
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
    dosage: f64,
    frequency: f64,
    supply: f64,
    measurement: String,
    nurse_id: String,
) -> Medication {
    Medication::create(
        app,
        &name,
        dosage,
        frequency,
        supply,
        &measurement,
        &nurse_id,
    )
}

/// # `get_medication_log` Command
/// Gets a user's medication logs for a single medication.
///
/// Parameters:
/// - `medication`: The medication to get the log for.
///
/// ## TypeScript Usage
///
/// ```typescript
/// invoke('get_medication_log', {medication: ''}).then(m => {
///     setMedicationLog(m as MedicationLog)
/// })
/// ```
#[tauri::command(rename_all = "snake_case")]
pub fn get_medication_logs(app: AppHandle, medication: String) -> Vec<MedicationLog> {
    // todo: please refactor. this is like, o(n^3)...
    // get_patient() == o(n) + search_medications() == o(n) + get_logs() == o(n)
    let mut m = get_patient(app.clone()).search_medications(app.clone(), &medication);

    if m.len() == 1 {
        return m[0].get_logs(app.clone());
    }

    vec![]
}

#[tauri::command(rename_all = "snake_case")]
pub fn get_medication(app: AppHandle, medication: String) -> Vec<Medication> {
    get_patient(app.clone()).search_medications(app.clone(), &medication)
}

#[tauri::command(rename_all = "snake_case")]
pub fn log_medication(app: AppHandle, medication: String, comments: Option<String>) -> f64 {
    let mut found_meds = get_patient(app.clone()).search_medications(app.clone(), &medication);

    if found_meds.len() > 0 {
        found_meds[0].log(app.clone(), comments)
    } else {
        0.0
    }
}
