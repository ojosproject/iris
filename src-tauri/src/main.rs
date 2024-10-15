#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
mod config;
mod dev;
mod medications;
mod menu;
mod pro;
mod resources;
mod structs;
mod user;
use crate::menu::menu;
use crate::structs::{Medication, Resource};
use std::{env, fs, process};
use structs::{PatientReportedOutcome, User};
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

/// # `get_config` Command
///
/// Returns the `config.json` file as an object. For more information on the
/// structure of `config.json`, check out the Config struct in `structs.rs`.
///
/// ## TypeScript Usage
///
/// ```typescript
/// invoke('get_config').then(c => {
///     console.log((c as Config).resources_last_call);
/// });
/// ```
#[tauri::command(rename_all = "snake_case")]
fn get_config(app: AppHandle) -> structs::Config {
    config::get_config(app.app_handle())
}

/// # `get_resources` Command
///
/// Returns all of the resources that are available to Iris. This also checks
/// the GitHub [resources repository](https://github.com/ojosproject/resources)
/// for any updates. Returns a `Resource[]`.
///
/// ## TypeScript Usage
///
/// ```typescript
/// invoke('get_resources').then(r => {
///     setResources(r as Resource[])
/// })
/// ```
#[tauri::command(rename_all = "snake_case")]
fn get_resources(app: AppHandle) -> Vec<Resource> {
    resources::get_resources(app.clone())
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
fn add_pros(app: AppHandle, pros: Vec<(String, String)>) {
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
            get_patient_info,
            get_config,
            get_resources,
            add_pros,
            get_all_pros,
            add_pro_question,
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
