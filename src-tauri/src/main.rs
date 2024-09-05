#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
mod dev;
mod medications;
mod menu;
mod structs;
mod user;
use crate::menu::menu;
use crate::structs::Medication;
use std::{env, fs, process};
use structs::{MedicationLog, User};
use tauri::{AppHandle, Manager};
use user::{get_patient, get_user};

#[tauri::command(rename_all = "snake_case")]
fn get_medications(app: AppHandle) -> Vec<Medication> {
    get_patient(app.clone()).get_medications(app)
}

#[tauri::command]
fn get_patient_info(app: AppHandle) -> User {
    get_patient(app)
}

#[tauri::command]
fn get_nurse_info(app: AppHandle, nurse_id: String) -> User {
    get_user(app, nurse_id)
}

#[tauri::command(rename_all = "snake_case")]
fn get_upcoming_medications(app: AppHandle) -> Vec<Medication> {
    get_patient(app.clone()).get_upcoming_medications(app)
}

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

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            get_medications,
            get_upcoming_medications,
            get_patient_info,
            get_nurse_info,
            get_medication_log
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
