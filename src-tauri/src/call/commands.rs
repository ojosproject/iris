// File:     call/commands.rs
// Purpose:  Commands for the Call tool.
// Authors:  Ojos Project & Iris contributors
// License:  GNU General Public License v3.0
use crate::helpers::data_dir;
use std::{env, process};
use tauri::AppHandle;

#[tauri::command]
pub fn open_recordings_folder(app: AppHandle) {
    let command = match env::consts::OS {
        "macos" => "open",
        "windows" => "explorer",
        "linux" => "xdg-open",
        _ => panic!("Cannot recognize the system."),
    };

    process::Command::new(command)
        .args([data_dir(&app).join("recordings")])
        .output()
        .unwrap();
}
