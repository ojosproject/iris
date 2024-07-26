#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
mod database;
mod medications;
mod user;

fn main() {
tauri::Builder::default()
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}