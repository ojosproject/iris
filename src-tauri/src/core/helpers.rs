use std::{
    path::PathBuf,
    time::{SystemTime, UNIX_EPOCH},
};

use rusqlite::Connection;
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
