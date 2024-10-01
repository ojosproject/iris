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
    // conditional asks if 30 minutes have passed since the last API call
    if last_call + 1800 < Utc::now().timestamp() {
        let resources_from_web = blocking::get(
            "https://raw.githubusercontent.com/ojosproject/resources/main/resources.json",
        )
        .unwrap_or_else(|error| 
            if error.is_connect() {
                _get_resources_from_database(app, resources);
                reqwest::blocking::Response::new("Failed to connect to API")
        })
        .json::<Vec<Resource>>()
        .expect("Failed to convert response");

        store_resources(app, resources_from_web);
        config::set_resources_last_call(app, Utc::now().timestamp());
    }

    resources = _get_resources_from_database(app, resources);

    resources
}

fn _get_resources_from_database(app: AppHandle, mut resources: Vec<Resource>) -> Vec<Resource> {
    // todo: ensure a call to an empty resources table returns an empty vec
    let app_data_dir = app.path().app_data_dir().unwrap().join("iris.db");
    let conn = Connection::open(app_data_dir).unwrap();
    let mut statement = conn
        .prepare("SELECT * FROM resource")
        .expect("Could not fetch resources from database.");

    let matched_resources = statement
        .query_map([], |row| {
            Ok(Resource {
                label: row.get(0)?,
                description: row.get(1)?,
                url: row.get(2)?,
                organization: row.get(3)?,
                category: row.get(4)?,
                last_updated: row.get(5)?,
            })
        })
        .expect("That did not work.");

    for resource in matched_resources {
        resources.push(resource.expect("ok"));
    }
    resources
}

/*
fn _test_internet_connection() -> bool {
    // sending a ping to 8.8.8.8, google's DNS server, is just a simple test
    // to ensure we have internet connection
    match Pinger::new().unwrap().send_ping("8.8.8.8", None, None) {
        Ok("8.8.8.8") => return true,
        Err(e) => return false,
    }
}
    */

pub fn store_resources(app: AppHandle, resources: Vec<Resource>) {
    let app_data_dir = app.path().app_data_dir().unwrap().join("iris.db");
    let conn = Connection::open(app_data_dir).unwrap();
    // INSERT OR IGNORE will skip an insertion if a primary or unique constraint
    // is failed.
    // In this case, if the url of a resource already exists in the table,
    // it won't crash
    for resource in resources {
        conn.execute(
            "INSERT OR IGNORE INTO resource (label, description, url, organization, type_of) VALUES (:label, :description, :url, :organization, :type_of)", 
            named_params! {":label": resource.label, ":description": resource.description, ":url": resource.url, ":organization": resource.organization, ":category": resource.category}
        ).expect("Inserting into resources failed.");
    }
}
