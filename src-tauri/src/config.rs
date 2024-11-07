// specs.rs
// Ojos Project
//
// Handles storing system specifications

#![allow(dead_code)]
use crate::structs::Config;
use std::{fs, io::ErrorKind, collections::HashMap};
use tauri::{App, AppHandle, Manager};

pub fn set_resources_last_call(app: AppHandle, value: i64) {
    let app_config_dir = app.path().app_config_dir().unwrap();

    let mut config = get_config(app.app_handle());
    config.resources_last_call = value;
    let config_string = serde_json::to_string(&config).unwrap();

    fs::write(app_config_dir.join("config.json"), config_string).unwrap();
}

//todo: fix the below method
// pub fn add_phone_number(app: AppHandle, number : String) {
//     let app_config_dir = app.path().app_config_dir().unwrap();

//     let mut config = get_config(app.app_handle());
//     config.phone_numbers.push(number);
//     let config_string = serde_json::to_string(&config).unwrap();

//     fs::write(app_config_dir.join("config.json"), config_string).unwrap();
// }

pub fn get_contacts(app:AppHandle) -> Vec<HashMap<String, String>> {
    let config = get_config(app.app_handle());
    config.contacts
}

//todo: maybe delete the below method
// pub fn get_phone_numbers(app: AppHandle) -> Vec<String> {
//     let config = get_config(app.app_handle());
//     config.phone_numbers
// }

pub fn get_config(app: &AppHandle) -> Config {
    let app_data_dir = app.path().app_config_dir().unwrap();

    let content = fs::read_to_string(app_data_dir.join("config.json")).unwrap_or_else(|error| {
        match error.kind() {
            ErrorKind::NotFound => {
                let template_config = Config {
                    resources_last_call: 0,
                    contacts : vec![HashMap::new()],
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
