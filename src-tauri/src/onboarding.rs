use crate::config::get_config;
use rusqlite::Connection;
use std::fs;
use tauri::{AppHandle, Manager};

pub fn setup_onboarding(app: &AppHandle) {
    let app_data_dir = app.path().app_data_dir().unwrap();

    if !app_data_dir.join("iris.db").exists() {
        fs::create_dir_all(&app_data_dir).unwrap();
        get_config(&app);

        let conn = Connection::open(app_data_dir.join("iris.db")).unwrap();
        conn.execute_batch(fs::read_to_string("./src/schema.sql").unwrap().as_str())
            .unwrap();
    }
}
