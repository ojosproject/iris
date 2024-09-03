// specs.rs
// Ojos Project
//
// Handles storing system specifications

#![allow(dead_code)]
use crate::structs::Specifications;
use serde;
use std::fs::write;
use tauri::{AppHandle, Manager};

pub fn check_specs(app: AppHandle, camera_available: bool, audio_available: bool) {
    let path = app.path().app_config_dir().unwrap().join("specs.json");
    let config = Specifications {
        camera_available: camera_available,
        audio_available: audio_available,
    };

    write(
        path,
        serde_json::to_string(&config).expect("Failed to convert struct into a string"),
    ).expect("Failed to save to app's config dir");
}
