// config.rs
// Ojos Project
//
// Various other projects, especially on Linux, use a config file that's
// typically just a plaintext file.

#![allow(dead_code)]
use super::structs::Config;
use std::{fs, io::ErrorKind};
use tauri::{AppHandle, Manager};

pub fn set_onboarding_completed(app: AppHandle, value: bool) {
    let app_config_dir = app.path().app_config_dir().unwrap();

    let mut config = get_config(app.app_handle());
    config.onboarding_completed = value;
    let config_string = serde_json::to_string(&config).unwrap();

    fs::write(app_config_dir.join("config.json"), config_string).unwrap();
}

pub fn get_config(app: &AppHandle) -> Config {
    let app_data_dir = app.path().app_config_dir().unwrap();

    let content = fs::read_to_string(app_data_dir.join("config.json")).unwrap_or_else(|error| {
        match error.kind() {
            ErrorKind::NotFound => {
                let template_config = Config {
                    onboarding_completed: false,
                };
                if !app_data_dir.exists() {
                    fs::create_dir(&app_data_dir).unwrap();
                }

                let template_config_string = serde_json::to_string(&template_config).unwrap();
                fs::write(app_data_dir.join("config.json"), &template_config_string).unwrap();
                template_config_string
            }
            other_error => panic!("A different kind of error occurred: {other_error:?}"),
        }
    });

    let config: Config = serde_json::from_str(&content).expect("Converting file to Config failed");
    config
}

pub fn set_config(app: &AppHandle, config: Config) {
    let app_config_dir = app.path().app_config_dir().unwrap();
    let config_string = serde_json::to_string(&config).unwrap();
    fs::write(app_config_dir.join("config.json"), config_string).unwrap();
}
