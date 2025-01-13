use crate::{care_instructions, config::get_config, medications, pro, resources};
use rusqlite::Connection;
use std::fs;
use tauri::{AppHandle, Manager};

use super::schema;

fn combine_schemas() -> String {
    let combined_schemas = schema::CORE_SCHEMA.to_string() + care_instructions::schema::CARE_INSTRUCTIONS_SCHEMA + medications::schema::MEDICATIONS_SCHEMA + pro::schema::PRO_SCHEMA + resources::schema::RESOURCES_SCHEMA;
    combined_schemas
}

pub fn setup_onboarding(app: &AppHandle) {
    let app_data_dir = app.path().app_data_dir().unwrap();

    if !app_data_dir.join("iris.db").exists() {
        fs::create_dir_all(app_data_dir.join("recordings/")).unwrap();
        get_config(&app);

        let conn = Connection::open(app_data_dir.join("iris.db")).unwrap();

        conn.execute_batch(&combine_schemas())
            .unwrap();
    }
}
