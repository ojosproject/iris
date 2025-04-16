use crate::{
    care_instructions, contacts, medications, pro, resources, settings::config::get_config,
};
use rusqlite::Connection;
use std::fs;
use tauri::{AppHandle, Manager};

fn combine_schemas() -> String {
    let combined_schemas = care_instructions::schema::CARE_INSTRUCTIONS_SCHEMA.to_string()
        + medications::schema::MEDICATIONS_SCHEMA
        + pro::schema::PRO_SCHEMA
        + resources::schema::RESOURCES_SCHEMA
        + contacts::schema::CONTACTS_SCHEMA;
    combined_schemas
}

pub fn setup_onboarding(app: &AppHandle) {
    let app_data_dir = app.path().app_data_dir().unwrap();

    if !app_data_dir.join("iris.db").exists() {
        fs::create_dir_all(app_data_dir.join("recordings/")).unwrap();
        get_config(&app);

        let conn = Connection::open(app_data_dir.join("iris.db")).unwrap();

        conn.execute_batch(&combine_schemas()).unwrap();
    }
}
