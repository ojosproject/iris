// ai/commands.rs
// Ojos Project
use tauri::{AppHandle, Manager};


#[tauri::command]
pub fn load_model(app: AppHandle) {
    let path = app.path().app_data_dir().unwrap();
    println!("{}", path.display().to_string());
}