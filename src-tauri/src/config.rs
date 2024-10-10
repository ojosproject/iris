// specs.rs
// Ojos Project
//
// Handles storing system specifications

#![allow(dead_code)]
use crate::structs::Config;
use std::{fs, io::ErrorKind};
use tauri::{App, AppHandle, Manager};

pub fn set_resources_last_call(app: AppHandle, value: i64) {
    let app_config_dir = app.path().app_config_dir().unwrap();

    let mut config = get_config(app.app_handle());
    config.resources_last_call = value;
    let config_string = serde_json::to_string(&config).unwrap();
    // This takes the existing json file, deserializes it into a Config struct
    // updates resources_last_call, then serializes it back into a
    // json-formatted string, and then writes to the file

    fs::write(app_config_dir.join("config.json"), config_string).unwrap();
}

pub fn add_pro_question(app:AppHandle, question: String) {
    let app_config_dir = app.path().app_config_dir().unwrap();

    let mut config = get_config(app.app_handle());
    config.pro_questions.push(question);
    let config_string = serde_json::to_string(&config).unwrap();

    fs::write(app_config_dir.join("config.json"), config_string).unwrap();
}

pub fn get_config(app: &AppHandle) -> Config {
    let app_data_dir = app.path().app_config_dir().unwrap();

    let content = fs::read_to_string(app_data_dir.join("config.json")).unwrap_or_else(|error| {
        match error.kind() {
            ErrorKind::NotFound => {
                let template_config = Config {
                    resources_last_call: 0,
                    pro_questions: vec![],
                };
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
