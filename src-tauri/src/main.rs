#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
mod medications;
mod menu;
mod structs;
mod user;
use crate::menu::menu;
use crate::structs::Medication;
use rusqlite::Connection;
use std::{env, fs, path::PathBuf, process};
use tauri::{AppHandle, Manager};
use user::get_patient;

fn create_database(file_path: PathBuf) {
    let connection = Connection::open(file_path).expect("Failed to open the database.");
    connection
        .execute_batch(
            fs::read_to_string("./src/schema.sql")
                .expect("Reading the schema file failed.")
                .as_str(),
        )
        .expect("Creating the file from SQL Schema failed.");

    connection
        .execute(
            "INSERT INTO user(id, full_name, type) VALUES ('0', 'patient', 'PATIENT')",
            [],
        )
        .unwrap();
}

#[tauri::command(rename_all = "snake_case")]
fn get_medications(app: AppHandle) -> Vec<Medication> {
    get_patient(app.clone()).get_medications(app)
}

#[tauri::command(rename_all = "snake_case")]
fn get_upcoming_medications(app: AppHandle) -> Vec<Medication> {
    get_patient(app.clone()).get_upcoming_medications(app)
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            get_medications,
            get_upcoming_medications
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
                }
            });

            let app_data_dir = app.path().app_data_dir().unwrap();

            println!("Iris DB location: {:?}", app_data_dir.join("iris.db"));
            println!("Use the \"Help\" menu to open it on your computer.");

            if !app_data_dir.join("iris.db").exists() {
                fs::create_dir_all(&app_data_dir).unwrap();

                create_database(app_data_dir.join("iris.db"));
            }

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
