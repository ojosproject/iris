// File:     updater/commands.rs
// Purpose:  The menu at the top of the app for desktop.
// Authors:  Ojos Project & Iris contributors
// License:  GNU General Public License v3.0
use std::fs;
use tauri::AppHandle;
use tauri_plugin_updater::UpdaterExt;

use crate::helpers::data_dir;

#[tauri::command]
pub fn check_update(app: AppHandle) {
    tauri::async_runtime::spawn(async move {
        if let Some(update) = app.updater().unwrap().check().await.unwrap() {
            println!("Some() entered.");

            let mut downloaded = 0;
            update
                .download_and_install(
                    |chunk_length, content_length| {
                        downloaded += chunk_length;
                        println!("downloaded {downloaded} from {content_length:?}");
                    },
                    || {
                        println!("download finished");
                    },
                )
                .await
                .unwrap();
            let app_data_dir = data_dir(&app);
            fs::remove_dir_all(app_data_dir).unwrap_or_else(|error| {
                println!("Failed to remove app_data_dir: `{:?}`", error);
            });
            app.restart();
        }
    });
}
