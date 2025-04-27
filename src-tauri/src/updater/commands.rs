use std::process::Command;

use tauri::AppHandle;
use tauri_plugin_updater::UpdaterExt;
use dirs::data_dir;

#[tauri::command]
pub fn check_update(app: AppHandle, install: bool) -> Result<(), String> {
    tauri::async_runtime::spawn(async move {
        if let Some(update) = app.updater().unwrap().check().await.unwrap() {
            if install {
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
            }
            return Ok(());
        } else {
            return Err(String::from("No updates available"));
        }
    });
    Ok(())
}

#[tauri::command]
pub fn delete_iris_data() -> Result<(), String> {
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

    //TODO fix restart app not working
    //restart_app()?;


    Ok(())


    // std::process::exit(0);

}

#[tauri::command]
pub fn restart_app() -> Result<(), String> {
    let current_exe = std::env::current_exe().map_err(|e| e.to_string())?;

    // Spawn a new instance of the app
    Command::new(current_exe)
        .spawn()
        .map_err(|e| format!("Failed to restart app: {}", e))?;

    // Exit the current process
    std::process::exit(0);
}
