use crate::config::get_config;
use rusqlite::Connection;
use std::{fs, path::PathBuf, str::FromStr};
use tauri::{AppHandle, Manager};

fn combine_schemas(search_folder: PathBuf) -> String {
    let folders = fs::read_dir(search_folder).unwrap();
    let mut full_schema = String::new();

    for file in folders {
        let unwrapped = file.unwrap();
        let schema_path = unwrapped.path().join("schema.sql");
        if unwrapped.metadata().unwrap().is_dir() && schema_path.exists() {
            full_schema.push_str(fs::read_to_string(schema_path).unwrap().as_str());
        }
    }

    full_schema
}

pub fn setup_onboarding(app: &AppHandle) {
    let app_data_dir = app.path().app_data_dir().unwrap();

    if !app_data_dir.join("iris.db").exists() {
        fs::create_dir_all(&app_data_dir).unwrap();
        get_config(&app);

        let conn = Connection::open(app_data_dir.join("iris.db")).unwrap();

        conn.execute_batch(&combine_schemas(PathBuf::from_str("./src/").unwrap()))
            .unwrap();
    }
}
