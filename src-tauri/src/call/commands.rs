use std::{env, process};
use tauri::{AppHandle, Manager};

#[tauri::command]
pub fn open_recordings_folder(app: AppHandle) {
    let command = match env::consts::OS {
        "macos" => "open",
        "windows" => "explore",
        "linux" => "xdg-open",
        _ => panic!("Cannot recognize the system."),
    };

    process::Command::new(command)
        .args([app.path().app_data_dir().unwrap().join("recordings/")])
        .output()
        .unwrap();
}
