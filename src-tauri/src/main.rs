#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
mod care_instructions;
mod core;
mod medications;
mod resources;
mod structs;
mod user;
use crate::menu::menu;
use crate::structs::Medication;
use crate::structs::{Medication, Resource};
use core::config;
use std::{env, fs, process};
use std::{env, process};
use structs::{MedicationLog, User};
use tauri::{AppHandle, Manager};
use user::{get_patient, get_user};

/// # `get_medications` Command
/// Get all of a patient's medications as a `Medication[]`.
///
/// ## TypeScript Usage
/// ```typescript
/// invoke('get_medications').then(m => {
///     setMedications(m as Medication[])
/// });
/// ```
///
#[tauri::command(rename_all = "snake_case")]
fn get_medications(app: AppHandle) -> Vec<Medication> {
    core::user::get_patient(app.clone()).get_medications(app)
}

/// # `get_nurse_info` Command
/// Gets a nurse's information and returns it as a `User`.
///
/// Parameters:
/// - `nurse_id`: the User ID
///
/// ## TypeScript Usage
/// ```typescript
/// invoke('get_nurse_info', {nurse_id: ''}).then(n => {
///     setNurseId(n as User);
/// });
/// ```
///
#[tauri::command]
fn get_patient_info(app: AppHandle) -> User {
    get_patient(app)
}

/// # `get_nurse_info` Command
/// Gets a nurse's information and returns it as a `User`.
///
/// Parameters:
/// - `nurse_id`: the User ID
///
/// ## TypeScript Usage
/// ```typescript
/// invoke('get_nurse_info', {nurse_id: ''}).then(n => {
///     setNurseId(n as User);
/// });
/// ```
///
#[tauri::command]
fn get_nurse_info(app: AppHandle, nurse_id: String) -> User {
    get_user(app, nurse_id)
}

/// # `get_upcoming_medications` Command
/// Gets the upcoming medications for a patient, returns a `Medication[]`.
///
/// ## TypeScript Usage
/// ```typescript
/// invoke('get_upcoming_medications').then(m => {
///     setUpcomingMedications(m as Medication[]);
/// });
/// ```
#[tauri::command(rename_all = "snake_case")]
fn get_upcoming_medications(app: AppHandle) -> Vec<Medication> {
    get_patient(app.clone()).get_upcoming_medications(app)
}

/// # `get_config` Command
///
/// Returns the `config.json` file as an object. For more information on the
/// structure of `config.json`, check out the Config struct in `structs.rs`.
///
/// ## TypeScript Usage
/// ```typescript
/// invoke('get_upcoming_medications').then(m => {
///     setUpcomingMedications(m as Medication[]);
/// });
/// ```
#[tauri::command(rename_all = "snake_case")]
fn get_upcoming_medications(app: AppHandle) -> Vec<Medication> {
    core::user::get_patient(app.clone()).get_upcoming_medications(app)
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
fn get_medication_log(app: AppHandle, medication: String) -> Vec<MedicationLog> {
    // todo: please refactor. this is like, o(n^3)...
    // get_patient() == o(n) + search_medications() == o(n) + get_logs() == o(n)
    let mut m = get_patient(app.clone()).search_medications(app.clone(), &medication);

    if m.len() == 1 {
        return m[0].get_logs(app.clone());
    }

    vec![]
}

#[tauri::command(rename_all = "snake_case")]
fn get_medication(app: AppHandle, medication: String) -> Vec<Medication> {
    get_patient(app.clone()).search_medications(app.clone(), &medication)
}

#[tauri::command(rename_all = "snake_case")]
fn create_medication(
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
        name.as_str(),
        brand.as_str(),
        dosage,
        frequency,
        supply,
        measurement.as_str(),
        nurse_id.as_str(),
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
fn get_medication_log(app: AppHandle, medication: String) -> Vec<MedicationLog> {
    // todo: please refactor. this is like, o(n^3)...
    // get_patient() == o(n) + search_medications() == o(n) + get_logs() == o(n)
    let mut m = get_patient(app.clone()).search_medications(app.clone(), &medication);

    if m.len() == 1 {
        return m[0].get_logs(app.clone());
    }

    vec![]
}

#[tauri::command(rename_all = "snake_case")]
fn get_medication(app: AppHandle, medication: String) -> Vec<Medication> {
    get_patient(app.clone()).search_medications(app.clone(), &medication)
}

#[tauri::command(rename_all = "snake_case")]
fn create_medication(
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
        name.as_str(),
        brand.as_str(),
        dosage,
        frequency,
        supply,
        measurement.as_str(),
        nurse_id.as_str(),
    )
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            get_medications,
            get_upcoming_medications,
            core::commands::get_patient_info,
            core::commands::get_config,
            core::commands::complete_onboarding,
            core::commands::create_user,
            care_instructions::commands::get_all_care_instructions,
            care_instructions::commands::create_care_instructions,
            care_instructions::commands::get_single_care_instruction,
            care_instructions::commands::update_care_instructions,
            care_instructions::commands::care_instructions_previous_next_ids,
            resources::commands::get_resources,
            get_patient_info,
            get_config,
            get_resources,
            get_nurse_info,
            get_medication_log,
            get_medication,
            create_medication
        ])
        .setup(|app| {
            app.set_menu(core::menu::menu(app.app_handle().clone()))
                .unwrap();

            app.on_menu_event(move |app, event| {
                let copy = app.clone();
                let command = match env::consts::OS {
                    "windows" => "explorer",
                    "macos" => "open",
                    "linux" => "xdg-open",
                    _ => panic!("This system cannot be used for Iris development."),
                };

                if event.id() == "help_app_data_dir" {
                    process::Command::new(command)
                        .args([copy.path().app_data_dir().unwrap()])
                        .output()
                        .unwrap();
                } else if event.id() == "help_app_config_dir" {
                    process::Command::new(command)
                        .args([copy.path().app_config_dir().unwrap()])
                        .output()
                        .unwrap();
                } else if event.id() == "import_test_data" {
                    println!("Importing testing.sql...");
                    core::dev::import_dummy_data(
                        app.path().app_data_dir().unwrap().join("iris.db"),
                    );
                    println!("Done.");
                } else if event.id() == "delete_db" {
                    let iris_path = app.path().app_data_dir().unwrap().join("iris.db");
                    println!("Deleting iris.db...");
                    core::dev::delete_database(iris_path.clone());
                    println!("Done!");

                    println!("Recreating iris.db...");
                    core::onboarding::setup_onboarding(app.app_handle());
                    println!("Done!");
                }
            });

            let app_data_dir = app.path().app_data_dir().unwrap();

            println!("Iris DB location: {:?}", app_data_dir.join("iris.db"));
            println!("Use the \"Help\" menu to open it on your computer.");

            core::onboarding::setup_onboarding(app.app_handle());

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
