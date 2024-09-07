// resources.rs
// Ojos Project

// Handles displaying resources to the user
#![allow(dead_code)]
use crate::config;
use crate::structs::Resource;
use chrono::Utc;
use reqwest::blocking;
use rusqlite::{named_params, Connection};
use tauri::{AppHandle, Manager};

pub fn get_resources(app: AppHandle) -> Vec<Resource> {
    let last_call = config::get_config(&app).resources_last_call;
    let mut resources = vec![];
    if last_call + 1800 < Utc::now().timestamp() {
        resources = blocking::get(
            "https://raw.githubusercontent.com/ojosproject/resources/main/resources.json",
        )
        .expect("Connection failed")
        .json::<Vec<Resource>>()
        .expect("Failed to convert response");
        config::set_resources_last_call(app, Utc::now().timestamp());
    }
    resources
}

pub fn store_resources(app: AppHandle, resources: Vec<Resource>) {
    let app_data_dir = app.path().app_data_dir().unwrap().join("iris.db");
    let conn = Connection::open(app_data_dir).unwrap();
    // INSERT OR IGNORE will skip an insertion if a primary or unique constraint is failed.
    // In this case, if the url of a resource already exists in the table, it won't crash
    for resource in resources {
        conn.execute(
            "INSERT OR IGNORE INTO resource (label, description, url, organization, type_of) VALUES (:label, :description, :url, :organization, :type_of)", 
            named_params! {":label": resource.label, ":description": resource.description, ":url": resource.url, ":organization": resource.organization, ":category": resource.category}
        ).expect("Inserting into resources failed.");
    }
}
