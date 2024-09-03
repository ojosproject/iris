// specs.rs
// Ojos Project
//
// Handles storing system specifications

#![allow(dead_code)]
use crate::structs::Config;
use std::fs;
use tauri::{AppHandle, Manager};

pub fn update_specs(app: AppHandle, camera_available: bool, audio_available: bool) {
    let path = app.path().app_config_dir().unwrap().join("specs.json");
    let config = Config {
        camera_available: camera_available,
        audio_available: audio_available,
    };
    fs::write(
        path,
        serde_json::to_string(&config).expect("Failed to convert struct into a string"),
    )
    .expect("Failed to save to app's config dir");
}

pub fn get_specs(app: AppHandle) -> Config {
    let content = fs::read_to_string(app.path().app_config_dir().unwrap().join("specs.json"))
        .expect("Reading file failed");
    let config: Config = serde_json::from_str(&content).expect("Converting file to Config failed");
    config
}
