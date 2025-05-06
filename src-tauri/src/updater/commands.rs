use std::fs;
use tauri::{AppHandle, Manager};
use tauri_plugin_updater::UpdaterExt;

/*
#[tauri::command]
pub fn delete_iris_data(app: AppHandle) -> Result<(), String> {
    let os = std::env::consts::OS;

    match os {
        "windows" => {
            let path = data_dir().unwrap().join("org.ojosproject.Iris");
            if path.exists() {
                std::fs::remove_dir_all(&path).map_err(|e| e.to_string())?;
            }
        }
        // "macos" => {
        //     let path = home.join("Library").join("Application Support").join("org.ojosproject.Iris");
        //     if path.exists() {
        //         std::fs::remove_dir_all(&path).map_err(|e| e.to_string())?;
        //     }
        // }
        // "linux" => {
        //     let path1 = home.join(".local").join("share").join("org.ojosproject.Iris");
        //     let path2 = home.join(".config").join("org.ojosproject.Iris");
        //     if path1.exists() {
        //         std::fs::remove_dir_all(&path1).map_err(|e| e.to_string())?;
        //     }
        //     if path2.exists() {
        //         std::fs::remove_dir_all(&path2).map_err(|e| e.to_string())?;
        //     }
        // }
        _ => return Err("Unsupported OS".to_string()),
    }

    match check_update(app, true) {
        Ok(_) => {
            //TODO fix restart app not working in dev, works fine with msi in cargo tauri build
            //app.restart();

            //TODO placeholder, remove after fixing restart app not working in dev
            Ok(())
        }
        Err(e) => Err(e.to_string()),
    }
}
*/
// we'll bring this back in a later iteration

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
            let app_data_dir = app.path().app_data_dir().unwrap();
            match fs::remove_dir(app_data_dir) {
                Ok(_) => {
                    println!("Deleted app_data_dir().")
                }
                Err(e) => println!("Failed to delete: \"{:?}\"", e),
            }
            app.restart();
        }
    });
}
