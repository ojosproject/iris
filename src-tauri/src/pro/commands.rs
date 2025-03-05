use super::helper;
use super::structs::PatientReportedOutcome;
use crate::core::config;
use tauri::AppHandle;

/// # `add_pro` Command
///
/// Adds inputted PRO information to the database.
///
/// ## TypeScript Usage
///
/// ```typescript
/// invoke('add_pro', {pros: []});
/// ```
#[tauri::command(rename_all = "snake_case")]
pub fn add_pros(app: AppHandle, pros: Vec<(String, i32)>) {
    helper::add_pros(app, pros);
} // MAKE SURE pro tuples are formatted with question first and response second!

/// # `get_all_pros` Command
///
/// Returns all PROs in the form of a vector of PRO objects. Check out the
/// PatientRecordedOutcome struct in `structs.rs` for more information.
///
/// ## TypeScript Usage
///
/// ```typescript
/// invoke('get_all_pros').then(all_pros => {
///     setPros(all_pros as PatientReportedOutcome[])
/// });
/// ```
#[tauri::command(rename_all = "snake_case")]
pub fn get_all_pros(app: AppHandle) -> Vec<PatientReportedOutcome> {
    helper::get_all_pros(app)
}

/// # `add_pro_question` Command
///
/// Adds a single String question to the pro_questions vector stored in the
/// device's config.json. Check out the Config struct in `structs.rs` for more
/// information.
///
/// ## TypeScript Usage
///
/// ```typescript
/// /*`.then()` not needed. Consider using `.catch()` for error handling. */
/// invoke('add_pro_question', {question: ""});
/// ```
#[tauri::command(rename_all = "snake_case")]
pub fn add_pro_question(app: AppHandle, question: String) {
    // config::add_pro_question(app, question);
}

#[tauri::command(rename_all = "snake_case")]
pub fn get_pro_questions(app: AppHandle) -> Vec<String> {
    config::get_config(&app).pro_questions
}
