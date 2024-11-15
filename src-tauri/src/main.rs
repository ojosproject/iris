#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
mod care_instructions;
mod core;
mod medications;
mod pro;
mod resources;
mod structs;
use crate::structs::Medication;
use core::config;
use std::{env, process};
use structs::{PatientReportedOutcome, User};
use tauri::{AppHandle, Manager};

#[tauri::command(rename_all = "snake_case")]
fn get_medications(app: AppHandle) -> Vec<Medication> {
    core::user::get_patient(app.clone()).get_medications(app)
}

#[tauri::command(rename_all = "snake_case")]
fn get_upcoming_medications(app: AppHandle) -> Vec<Medication> {
    core::user::get_patient(app.clone()).get_upcoming_medications(app)
}

/// # `add_pro` Command
///
/// Adds inputted PRO information to the database.
///
/// ## TypeScript Usage
///
/// ```typescript
/// invoke('add_pro', {recorded_date: "", question: "", response: ""});
/// ```
#[tauri::command(rename_all = "snake_case")]
fn add_pros(app: AppHandle, pros: Vec<(String, i32)>) {
    pro::add_pros(app, pros);
} // MAKE SURE pro tuples are formatted with question first and response second!

/// # `get_all_pros` Command
///
/// Returns all PROs in the form of a vector of PRO objects. Check out the
/// PatientRecordedOutcome struct in `structs.rs` for more information.
///
/// ## TypeScript Usage
///
/// ```typescript
/// invoke('get_all_pros').then(all_pros => {
///     setPros(all_pros as PatientReportedOutcome[])
/// });
/// ```
#[tauri::command(rename_all = "snake_case")]
fn get_all_pros(app: AppHandle) -> Vec<PatientReportedOutcome> {
    pro::get_all_pros(app)
}

/// # `add_pro_question` Command
///
/// Adds a single String question to the pro_questions vector stored in the
/// device's config.json. Check out the Config struct in `structs.rs` for more
/// information.
///
/// ## TypeScript Usage
///
/// ```typescript
/// /*`.then()` not needed. Consider using `.catch()` for error handling. */
/// invoke('add_pro_question', {question: ""});
/// ```
#[tauri::command(rename_all = "snake_case")]
fn add_pro_question(app: AppHandle, question: String) {
    config::add_pro_question(app, question);
}

/// # `add_pro` Command
///
/// Adds inputted PRO information to the database.
///
/// ## TypeScript Usage
///
/// ```typescript
/// invoke('add_pro', {recorded_date: "", question: "", response: ""});
/// ```
#[tauri::command(rename_all = "snake_case")]
fn add_pros(app: AppHandle, pros: Vec<(String, i32)>) {
    pro::add_pros(app, pros);
} // MAKE SURE pro tuples are formatted with question first and response second!

/// # `get_all_pros` Command
///
/// Returns all PROs in the form of a vector of PRO objects. Check out the
/// PatientRecordedOutcome struct in `structs.rs` for more information.
///
/// ## TypeScript Usage
///
/// ```typescript
/// invoke('get_all_pros').then(all_pros => {
///     setPros(all_pros as PatientReportedOutcome[])
/// });
/// ```
#[tauri::command(rename_all = "snake_case")]
fn get_all_pros(app: AppHandle) -> Vec<PatientReportedOutcome> {
    pro::get_all_pros(app)
}

/// # `add_pro_question` Command
///
/// Adds a single String question to the pro_questions vector stored in the
/// device's config.json. Check out the Config struct in `structs.rs` for more
/// information.
///
/// ## TypeScript Usage
///
/// ```typescript
/// /*`.then()` not needed. Consider using `.catch()` for error handling. */
/// invoke('add_pro_question', {question: ""});
/// ```
#[tauri::command(rename_all = "snake_case")]
fn add_pro_question(app: AppHandle, question: String) {
    config::add_pro_question(app, question);
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
