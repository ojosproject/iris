// specs.rs
// Ojos Project
//
// Handles storing system specifications

#![allow(dead_code)]
use crate::structs::Config;
use std::fs;
use tauri::{AppHandle, Manager};

pub fn set_resources_last_call(app: AppHandle, value: i64) {
    let app_config_dir = app.path().app_config_dir().unwrap();

    let mut config = get_config(app.app_handle());
    config.resources_last_call = value;
    let config_string = serde_json::to_string(&config).unwrap();

    fs::write(app_config_dir.join("config.json"), config_string).unwrap();
}

pub fn get_config(app: &AppHandle) -> Config {
    let content = fs::read_to_string(app.path().app_config_dir().unwrap().join("config.json"))
        .expect("Reading file failed");
    let config: Config = serde_json::from_str(&content).expect("Converting file to Config failed");
    config
}
