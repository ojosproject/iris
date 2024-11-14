use crate::core::config;
use crate::core::structs::Config;
use crate::core::structs::User;
use crate::core::user;
use tauri::AppHandle;

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
pub fn get_config(app: AppHandle) -> Config {
    config::get_config(&app)
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
pub fn complete_onboarding(app: AppHandle) {
    config::set_onboarding_completed(app, true);
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
pub fn create_user(app: AppHandle, name: String, user_type: String) {
    User::create(app, name, user_type);
}

#[tauri::command]
pub fn get_patient_info(app: AppHandle) -> User {
    user::get_patient(app)
}
