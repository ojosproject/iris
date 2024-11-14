#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
mod care_instructions;
mod config;
mod dev;
mod medications;
mod menu;
mod onboarding;
mod resources;
mod structs;
mod user;
use crate::menu::menu;
use crate::structs::{Medication, Resource};
use config::set_onboarding_completed;
use onboarding::setup_onboarding;
use std::{env, process};
use structs::User;
use tauri::{AppHandle, Manager};
use user::get_patient;

#[tauri::command(rename_all = "snake_case")]
fn get_medications(app: AppHandle) -> Vec<Medication> {
    get_patient(app.clone()).get_medications(app)
}

#[tauri::command]
fn get_patient_info(app: AppHandle) -> User {
    get_patient(app)
}

#[tauri::command(rename_all = "snake_case")]
fn get_upcoming_medications(app: AppHandle) -> Vec<Medication> {
    get_patient(app.clone()).get_upcoming_medications(app)
}

/// # `get_config` Command
///
/// Returns the `config.json` file as an object. For more information on the
/// structure of `config.json`, check out the Config struct in `structs.rs`.
///
/// ## TypeScript Usage
///
/// ```typescript
/// invoke('get_config').then(c => {
///     console.log((c as Config).resources_last_call);
/// });
/// ```
#[tauri::command(rename_all = "snake_case")]
fn get_config(app: AppHandle) -> structs::Config {
    config::get_config(app.app_handle())
}

/// # `get_resources` Command
///
/// Returns all of the resources that are available to Iris. This also checks
/// the GitHub [resources repository](https://github.com/ojosproject/resources)
/// for any updates. Returns a `Resource[]`.
///
/// ## TypeScript Usage
///
/// ```typescript
/// invoke('get_resources').then(r => {
///     setResources(r as Resource[])
/// })
/// ```
#[tauri::command(rename_all = "snake_case")]
fn get_resources(app: AppHandle) -> Vec<Resource> {
    resources::get_resources(app.clone())
}

/// # `complete_onboarding` Command
///
/// Sets the `onboarding_completed` value in the `config.json` to `true`.
///
/// ## TypeScript Usage
///
/// ```typescript
/// invoke("complete_onboarding");
/// ```
#[tauri::command(rename_all = "snake_case")]
fn complete_onboarding(app: AppHandle) {
    set_onboarding_completed(app, true);
}

/// # `create_user` Command
///
/// Creates a user for the program.
///
/// ## TypeScript Usage
///
/// ```typescript
/// invoke("create_user", {name: "", user_type: ""});
/// ```
///
#[tauri::command(rename_all = "snake_case")]
fn create_user(app: AppHandle, name: String, user_type: String) {
    User::create(app, name, user_type);
}

/// # `get_care_instructions` Command
///
/// Returns a `CareInstruction[]`.
///
/// ## TypeScript Usage
///
/// ```typescript
/// invoke('get_care_instructions').then(ci => {
///     setCareInstructions(ci as CareInstruction[]);
/// });
/// ```
#[tauri::command]
fn get_care_instructions(app: AppHandle) -> Vec<structs::CareInstruction> {
    care_instructions::get_all_care_instructions(&app)
}

#[tauri::command(rename_all = "snake_case")]
fn get_single_care_instruction(app: AppHandle, id: String) -> Option<structs::CareInstruction> {
    for instruction in care_instructions::get_all_care_instructions(&app) {
        if instruction.id == id {
            return Some(instruction);
        }
    }
    return None;
    /* `CareInstruction` value */
}

/// # `create_care_instruction` Command
///
/// Creates a new `CareInstruction` and returns it
///
/// ## TypeScript Usage
///
/// ```typescript
/// invoke('create_care_instruction', {
///         text: 'Please help her move once in a while.',
///         readable_frequency: 'Once daily',
///         added_by: 'nurse_id'
///     }).then(ci => {
///     setCareInstructions(ci as CareInstruction);
/// })
/// ```
#[tauri::command(rename_all = "snake_case")]
fn create_care_instructions(
    app: AppHandle,
    title: String,
    content: String,
    frequency: Option<String>,
    added_by: String,
) -> structs::CareInstruction {
    care_instructions::add_care_instruction(&app, title, content, frequency, added_by)
}

#[tauri::command(rename_all = "snake_case")]
fn command_update_care_instructions(
    app: AppHandle,
    id: String,
    title: String,
    content: String,
    frequency: Option<String>,
    added_by: String,
) -> structs::CareInstruction {
    care_instructions::update_care_instructions(&app, id, title, content, frequency, added_by)
}

#[tauri::command(rename=all = "snake_case")]
fn command_care_instructions_previous_next(app: AppHandle, id: String) -> Vec<String> {
    let instructions = care_instructions::get_all_care_instructions(&app);
    let mut previous = 0;
    let mut next = 0;
    for (index, instruction) in instructions.iter().enumerate() {
        if instruction.id == id {
            if instructions.len() == 1 {
                [previous, next] = [0, 0]
            } else if index == 0 {
                previous = instructions.len() - 1;
                next = index + 1;
            } else if index == instructions.len() - 1 {
                previous = index - 1;
                next = 0;
            } else {
                previous = index - 1;
                next = index + 1;
            }
        }
    }

    return vec![
        (&instructions[previous]).id.clone(),
        (&instructions[next]).id.clone(),
    ];
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            get_medications,
            get_upcoming_medications,
            get_patient_info,
            get_config,
            get_resources,
            complete_onboarding,
            create_user,
            get_care_instructions,
            create_care_instructions,
            get_single_care_instruction,
            command_update_care_instructions,
            command_care_instructions_previous_next
        ])
        .setup(|app| {
            app.set_menu(menu(app.app_handle().clone())).unwrap();

            app.on_menu_event(move |app, event| {
                let copy = app.clone();
                let command = match env::consts::OS {
                    "windows" => "explorer",
                    "macos" => "open",
                    "linux" => "xdg-open",
                    _ => panic!("This system cannot be used for Iris development."),
                };

                if event.id() == "help_app_data_dir" {
                    process::Command::new(command)
                        .args([copy.path().app_data_dir().unwrap()])
                        .output()
                        .unwrap();
                } else if event.id() == "help_app_config_dir" {
                    process::Command::new(command)
                        .args([copy.path().app_config_dir().unwrap()])
                        .output()
                        .unwrap();
                } else if event.id() == "import_test_data" {
                    println!("Importing testing.sql...");
                    dev::import_dummy_data(app.path().app_data_dir().unwrap().join("iris.db"));
                    println!("Done.");
                } else if event.id() == "delete_db" {
                    let iris_path = app.path().app_data_dir().unwrap().join("iris.db");
                    println!("Deleting iris.db...");
                    dev::delete_database(iris_path.clone());
                    println!("Done!");

                    println!("Recreating iris.db...");
                    setup_onboarding(app.app_handle());
                    println!("Done!");
                }
            });

            let app_data_dir = app.path().app_data_dir().unwrap();

            println!("Iris DB location: {:?}", app_data_dir.join("iris.db"));
            println!("Use the \"Help\" menu to open it on your computer.");

            setup_onboarding(app.app_handle());

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
