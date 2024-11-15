// config.rs
// Ojos Project
//
// Works with storing data that isn't needed in the database. Think settings.

#![allow(dead_code)]
use crate::core::structs::Config;
use std::{fs, io::ErrorKind};
use tauri::{AppHandle, Manager};

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

pub fn add_pro_question(app: AppHandle, question: String) {
    let app_config_dir = app.path().app_config_dir().unwrap();

    let mut config = get_config(app.app_handle());
    config.pro_questions.push(question);
    let config_string = serde_json::to_string(&config).unwrap();

    fs::write(app_config_dir.join("config.json"), config_string).unwrap();
}

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
                    resources_last_call: 0,
                    onboarding_completed: false,
                    pro_questions: vec![
                        "During the past 4 weeks, how much of the time have you had any of the
following problems with your work or other regular daily activities as a
result of your physical health?"
                            .to_string(),
                        "During the past 4 weeks, how much of the time have you had any of the
following problems with your work or other regular daily activities as a
result of any emotional problems (such as feeling depressed or anxious)?"
                            .to_string(),
                        "During the past 4 weeks, to what extent has your physical health or
emotional problems interfered with your normal social activities with
family, friends, neighbors, or groups?"
                            .to_string(),
                        "How much bodily pain have you had during the past 4 weeks?".to_string(),
                        "During the past 4 weeks, how much did pain interfere with your normal
work (including both work outside the home and housework)?"
                            .to_string(),
                        "Compared to one year ago, how would you rate your health in general
now?"
                            .to_string(),
                        "Please rate your ability to carry a shopping bag or briefcase".to_string(),
                        "Please rate your ability to wash your back".to_string(),
                        "Please rate your ability to use a knife to cut food".to_string(),
                    ],
                };
                //fs::create_dir(&app_data_dir).unwrap();
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
