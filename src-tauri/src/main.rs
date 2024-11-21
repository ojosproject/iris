#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
mod care_instructions;
mod core;
mod medications;
mod pro;
mod resources;
use core::config;
use std::{env, process};
use tauri::Manager;

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            medications::commands::create_medication,
            medications::commands::get_medications,
            medications::commands::get_upcoming_medications,
            medications::commands::get_medication,
            medications::commands::get_medication_logs,
            medications::commands::log_medication,
            core::commands::get_patient_info,
            core::commands::get_config,
            core::commands::complete_onboarding,
            core::commands::get_nurse_info,
            core::commands::create_user,
            care_instructions::commands::get_all_care_instructions,
            care_instructions::commands::create_care_instructions,
            care_instructions::commands::get_single_care_instruction,
            care_instructions::commands::update_care_instructions,
            care_instructions::commands::care_instructions_previous_next_ids,
            pro::commands::add_pros,
            pro::commands::get_all_pros,
            pro::commands::add_pro_question,
            pro::commands::get_pro_questions,
            resources::commands::get_resources,
        ])
        .setup(|app| {
            app.set_menu(core::menu::menu(app.app_handle().clone()))
                .unwrap();

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
                    core::dev::import_dummy_data(
                        app.path().app_data_dir().unwrap().join("iris.db"),
                    );
                    println!("Done.");
                } else if event.id() == "delete_db" {
                    let iris_path = app.path().app_data_dir().unwrap().join("iris.db");
                    println!("Deleting iris.db...");
                    core::dev::delete_database(iris_path.clone());
                    println!("Done!");

                    println!("Recreating iris.db...");
                    core::onboarding::setup_onboarding(app.app_handle());
                    println!("Done!");
                }
            });

            let app_data_dir = app.path().app_data_dir().unwrap();

            println!("Iris DB location: {:?}", app_data_dir.join("iris.db"));
            println!("Use the \"Help\" menu to open it on your computer.");

            core::onboarding::setup_onboarding(app.app_handle());

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
