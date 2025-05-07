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

fn preload_content(conn: &Connection) {
    conn.execute_batch(
        r#"INSERT INTO resource (label, description, url, organization, category, last_updated) VALUES ("Support Email", "Have an issue with your device? Email contact@ojosproject.org for support! Ojos Project is the group behind Palliaview and the Iris software. We're here to help.", "mailto:contact@ojosproject.org", "Ojos Project", "DEVICE", 1746601200);"#).unwrap();
}

pub fn setup_onboarding(app: &AppHandle) {
    let app_data_dir = app.path().app_data_dir().unwrap();

    if !app_data_dir.join("iris.db").exists() {
        fs::create_dir_all(app_data_dir.join("recordings/")).unwrap();
        get_config(&app);

        let conn = Connection::open(app_data_dir.join("iris.db")).unwrap();

        conn.execute_batch(&combine_schemas()).unwrap();
        preload_content(&conn);
    }
}
