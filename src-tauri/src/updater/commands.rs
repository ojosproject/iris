use tauri::{AppHandle, Manager};
use tauri_plugin_updater::UpdaterExt;

pub fn delete_iris_data(app: AppHandle) -> Result<(), String> {
    let app_data_dir_path = app.path().app_data_dir().unwrap();
    if app_data_dir_path.exists() {
        std::fs::remove_dir_all(&app_data_dir_path).map_err(|e| e.to_string())?;
        Ok(())
    } else {
        Err(String::from("App Data Dir does not exist."))
    }
}

#[tauri::command]
pub async fn check_update(app: AppHandle) -> Result<(), String> {

    //TODO uncomment this when testing
    //return Ok(());
    

    //TODO comment the rest of this out when testing
    let updater = app.updater().map_err(|e| e.to_string())?;

    match updater.check().await {
        Ok(Some(_update)) => Ok(()),
        Ok(None) => Err("There are no updates to install!".to_string()),
        Err(e) => Err(format!("Failed to check for updates: {}", e)),
    }
}

#[tauri::command]
pub async fn install_update(app: AppHandle) -> Result<(), String> {
    let updater = app.updater().map_err(|e| e.to_string())?;

    match updater.check().await {
        Ok(Some(update)) => {
            delete_iris_data(app.clone())?; // delete Iris if success path reached
            let mut downloaded = 0;
            update
                .download_and_install(
                    |chunk_length, content_length| {
                        downloaded += chunk_length;
                        println!("Downloaded {downloaded} / {content_length:?}");
                    },
                    || {
                        println!("Download finished");
                    },
                )
                .await
                .map_err(|e| format!("Failed to install update: {}", e))?;
            Ok(())
        }
        Ok(None) => Err("There's no update to install".to_string()),
        Err(e) => Err(format!("Failed to check for updates: {}", e)),
    }
}

#[tauri::command]
pub fn restart_app(app: AppHandle) {
    app.restart();
}
