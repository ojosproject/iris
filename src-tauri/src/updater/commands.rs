use tauri::AppHandle;
use tauri_plugin_updater::UpdaterExt;

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
