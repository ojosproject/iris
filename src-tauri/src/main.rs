#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
mod database;
mod medications;
mod user;

use crate::user::User;
use crate::medications::Medication;

#[tauri::command(rename_all = "snake_case")]
fn authenticate_user(credential: String) -> Result<user::User, String> {
    match user::User::new(credential) {
        Ok(matched_user) => {Ok(matched_user)}
        Err(_) => {Err("User does not exist.".into())}
    }
}

#[tauri::command(rename_all = "snake_case")]
fn create_user(full_name: String, type_of: String, credential: String) -> User {
    User::create(full_name, type_of, credential)
}

#[tauri::command(rename_all = "snake_case")]
fn get_medications(credential: String) -> Vec<Medication> {
    User::new(credential).expect("Credential is invalid.").get_medications().expect("Medications failed to get.")
}

fn main() {
tauri::Builder::default()
    .invoke_handler(tauri::generate_handler![authenticate_user, create_user, get_medications])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}