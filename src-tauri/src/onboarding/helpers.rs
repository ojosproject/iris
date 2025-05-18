// File:     onboarding/helpers.rs
// Purpose:  Helper functions for the onboarding process.
// Authors:  Ojos Project & Iris contributors
// License:  GNU General Public License v3.0
use crate::{
    care_instructions, contacts,
    helpers::{data_dir, db_connect},
    medications, pro, resources,
    settings::commands::get_config,
};
use std::fs;
use tauri::AppHandle;

fn combine_schemas() -> String {
    let combined_schemas = care_instructions::schema::CARE_INSTRUCTIONS_SCHEMA.to_string()
        + medications::schema::MEDICATIONS_SCHEMA
        + pro::schema::PRO_SCHEMA
        + resources::schema::RESOURCES_SCHEMA
        + contacts::schema::CONTACTS_SCHEMA;
    combined_schemas
}

pub fn setup_onboarding(app: &AppHandle) {
    let app_data_dir = data_dir(&app);

    if !app_data_dir.join("iris.db").exists() {
        fs::create_dir_all(app_data_dir.join("recordings/")).unwrap();

        // todo: figure out a different way. `.to_owned()` clones.
        get_config(app.to_owned());

        let conn = db_connect(&app);

        conn.execute_batch(&combine_schemas()).unwrap();
    }
}
