// File:     helpers.rs
// Purpose:  Tasks that need to be completed often, such as timestamps.
// Authors:  Ojos Project & Iris contributors
// License:  GNU General Public License v3.0
use rusqlite::Connection;
use std::{
    path::PathBuf,
    time::{SystemTime, UNIX_EPOCH},
};
use tauri::{AppHandle, Manager};
use uuid::Uuid;

pub fn unix_timestamp() -> i64 {
    SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .unwrap()
        .as_secs() as i64
}

pub fn stamp() -> (i64, String) {
    (unix_timestamp(), Uuid::new_v4().to_string())
}

pub fn db_connect(app: &AppHandle) -> Connection {
    Connection::open(app.path().app_data_dir().unwrap().join("iris.db"))
        .expect("Connection to iris.db failed.")
}

pub fn data_dir(app: &AppHandle) -> PathBuf {
    app.path()
        .app_data_dir()
        .expect("Failed to open the app_data_dir. Read the docs: https://docs.rs/tauri/latest/tauri/path/struct.PathResolver.html#method.app_data_dir")
}

pub fn config_dir(app: &AppHandle) -> PathBuf {
    app.path()
        .app_config_dir()
        .expect("Failed to open the config_data_dir. Read the docs: https://docs.rs/tauri/latest/tauri/path/struct.PathResolver.html#method.app_config_dir")
}
