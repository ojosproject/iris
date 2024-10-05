#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
mod care_instructions;
mod config;
mod dev;
mod medications;
mod menu;
mod structs;
mod user;
use crate::menu::menu;
use crate::structs::Medication;
use std::{env, fs, process};
use structs::User;
use tauri::{AppHandle, Manager};
use user::get_patient;

#[tauri::command(rename_all = "snake_case")]
fn get_medications(app: AppHandle) -> Vec<Medication> {
    get_patient(app.clone()).get_medications(app)
}

#[tauri::command]
fn get_patient_info(app: AppHandle) -> User {
    get_patient(app)
}

#[tauri::command(rename_all = "snake_case")]
fn get_upcoming_medications(app: AppHandle) -> Vec<Medication> {
    get_patient(app.clone()).get_upcoming_medications(app)
}

#[tauri::command(rename_all = "snake_case")]
fn get_config(app: AppHandle) -> structs::Config {
    config::get_config(app.app_handle())
}

/// # `get_care_instructions` Command
///
/// Returns a `CareInstruction[]`.
///
/// ## TypeScript Usage
///
/// ```typescript
/// invoke('get_care_instructions').then(ci => {
///     setCareInstructions(ci as CareInstruction[]);
/// });
/// ```
#[tauri::command]
fn get_care_instructions(app: AppHandle) -> Vec<structs::CareInstruction> {
    care_instructions::get_all_care_instructions(&app)
}

/// # `create_care_instruction` Command
///
/// Creates a new `CareInstruction` and returns it
///
/// ## TypeScript Usage
///
/// ```typescript
/// invoke('create_care_instruction', {
///         text: 'Please help her move once in a while.',
///         readable_frequency: 'Once daily',
///         added_by: 'nurse_id'
///     }).then(ci => {
///     setCareInstructions(ci as CareInstruction);
/// })
/// ```
#[tauri::command]
fn create_care_instruction(
    app: AppHandle,
    text: String,
    readable_frequency: String,
    added_by: String,
) -> structs::CareInstruction {
    care_instructions::add_care_instruction(&app, text, readable_frequency, added_by)
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            get_medications,
            get_upcoming_medications,
            get_patient_info,
            get_config,
            get_care_instructions,
            create_care_instruction
        ])
        .setup(|app| {
            app.set_menu(menu(app.app_handle().clone())).unwrap();

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
                    dev::import_dummy_data(app.path().app_data_dir().unwrap().join("iris.db"));
                    println!("Done.");
                } else if event.id() == "delete_db" {
                    let iris_path = app.path().app_data_dir().unwrap().join("iris.db");
                    println!("Deleting iris.db...");
                    dev::delete_database(iris_path.clone());
                    println!("Done!");

                    println!("Recreating iris.db...");
                    dev::create_database(iris_path.clone());
                    println!("Done!");
                }
            });

            let app_data_dir = app.path().app_data_dir().unwrap();

            println!("Iris DB location: {:?}", app_data_dir.join("iris.db"));
            println!("Use the \"Help\" menu to open it on your computer.");

            if !app_data_dir.join("iris.db").exists() {
                fs::create_dir_all(&app_data_dir).unwrap();

                dev::create_database(app_data_dir.join("iris.db"));
            }

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
