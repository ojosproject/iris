#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
mod database;
mod medications;
mod structs;
mod user;

use crate::structs::{Medication, User};
use database::Database;
use tauri::Manager;

#[tauri::command(rename_all = "snake_case")]
fn create_user(full_name: String, type_of: String) -> User {
    User::create(full_name, type_of)
}

#[tauri::command(rename_all = "snake_case")]
fn get_medications() -> Vec<Medication> {
    Database::new().get_all_medications()
}

#[tauri::command(rename_all = "snake_case")]
fn get_upcoming_medications() -> Vec<Medication> {
    User::new("patient".to_string())
        .unwrap()
        .get_upcoming_medications()
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            create_user,
            get_medications,
            get_upcoming_medications
        ])
        .setup(|_| {
            let mut db = Database::new();
            match db.user_exists("patient".to_string()) {
                // if no user exists in the beginning, create one named "patient"
                Err(_) => db.create_user("patient".to_string(), "PATIENT".to_string()),
                Ok(u) => u,
            };
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
