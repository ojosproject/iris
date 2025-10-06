// File:     lib.rs
// Purpose:  Entry point for Iris.
// Authors:  Ojos Project & Iris contributors
// License:  GNU General Public License v3.0
mod helpers;
use helpers::data_dir;
use std::{env, process};
use tauri::Manager;
#[cfg(any(target_os = "linux", target_os = "macos", target_os = "windows"))]
mod menu;
#[cfg(any(target_os = "linux", target_os = "macos", target_os = "windows"))]
use menu::menu;
#[cfg(any(target_os = "linux", target_os = "macos", target_os = "windows"))]
use tauri_plugin_autostart::MacosLauncher;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let mut builder = tauri::Builder::default()
        .plugin(tauri_plugin_sql::Builder::new().build())
        .plugin(tauri_plugin_opener::init());

    #[cfg(any(target_os = "linux", target_os = "macos", target_os = "windows"))]
    {
        builder = builder
            .plugin(tauri_plugin_autostart::init(
                MacosLauncher::LaunchAgent,
                Some(vec![]),
            ))
            .plugin(tauri_plugin_process::init())
            .plugin(tauri_plugin_updater::Builder::new().build());
    }

    builder
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_os::init())
        .plugin(tauri_plugin_fs::init())
        .setup(|app| {
            #[cfg(any(target_os = "linux", target_os = "macos", target_os = "windows"))]
            {
                app.set_menu(menu(&app.app_handle())).unwrap();

                app.on_menu_event(move |app, event| {
                    let command = match env::consts::OS {
                        "windows" => "explorer",
                        "macos" => "open",
                        "linux" => "xdg-open",
                        _ => panic!("This system cannot be used for Iris development."),
                    };

                    if event.id() == "open-recordings" {
                        process::Command::new(command)
                            .args(data_dir(&app).join("recordings").to_str())
                            .output()
                            .unwrap();
                    }
                });
            }

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
