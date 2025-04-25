#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
mod call;
mod care_instructions;
mod contacts;
mod helpers;
mod medications;
mod menu;
mod onboarding;
mod pro;
mod resources;
mod settings;
mod updater;
use menu::menu;
use onboarding::helpers::setup_onboarding;
use std::{env, process};
use tauri::Manager;

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_updater::Builder::new().build())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_os::init())
        .plugin(tauri_plugin_fs::init())
        .invoke_handler(tauri::generate_handler![
            medications::commands::create_medication,
            medications::commands::search_medications,
            medications::commands::get_medications,
            medications::commands::delete_medication,
            medications::commands::update_medication,
            medications::commands::log_medication,
            medications::commands::get_medication_logs,
            settings::commands::get_config,
            settings::commands::set_config,
            settings::commands::import_data_pack,
            settings::commands::complete_onboarding,
            care_instructions::commands::get_all_care_instructions,
            care_instructions::commands::create_care_instructions,
            care_instructions::commands::get_single_care_instruction,
            care_instructions::commands::update_care_instructions,
            care_instructions::commands::care_instructions_previous_next_ids,
            care_instructions::commands::delete_care_instructions,
            pro::commands::add_pros,
            pro::commands::get_all_pros,
            pro::commands::get_pro_questions,
            resources::commands::get_resources,
            call::commands::open_recordings_folder,
            contacts::commands::get_all_contacts,
            contacts::commands::get_single_contact,
            contacts::commands::create_contact,
            contacts::commands::update_contact,
            contacts::commands::delete_contact,
            contacts::commands::get_patient_contact,
            contacts::commands::disable_relay_for_contacts,
            updater::commands::check_update,
        ])
        .setup(|app| {
            app.set_menu(menu(&app.app_handle())).unwrap();

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
                } else if event.id() == "open-recordings" {
                    process::Command::new(command)
                        .args(
                            app.path()
                                .app_data_dir()
                                .unwrap()
                                .join("recordings")
                                .to_str(),
                        )
                        .output()
                        .unwrap();
                }
            });
            setup_onboarding(app.app_handle());
            

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
