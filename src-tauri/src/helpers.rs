// File:     helpers.rs
// Purpose:  Tasks that need to be completed often, such as timestamps.
// Authors:  Ojos Project & Iris contributors
// License:  GNU General Public License v3.0
use std::path::PathBuf;
use tauri::{AppHandle, Manager};

pub fn data_dir(app: &AppHandle) -> PathBuf {
    app.path()
        .app_data_dir()
        .expect("Failed to open the user data folder. Read the docs: https://docs.rs/tauri/latest/tauri/path/struct.PathResolver.html#method.app_data_dir").join("user/")
}
