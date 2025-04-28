use super::structs::PatientReportedOutcome;
use super::{helper, structs::ProQuestion};
use rusqlite::Connection;
use tauri::{AppHandle, Manager};

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
/// invoke<PatientReportedOutcome[]>('get_all_pros').then(all_pros => {
///     setPros(all_pros)
/// });
/// ```
#[tauri::command(rename_all = "snake_case")]
pub fn get_all_pros(app: AppHandle) -> Vec<PatientReportedOutcome> {
    helper::get_all_pros(app)
}

#[tauri::command(rename_all = "snake_case")]
pub fn get_pro_questions(app: AppHandle) -> Vec<ProQuestion> {
    let path = app.path().app_data_dir().unwrap();
    let conn = Connection::open(path.join("iris.db")).unwrap();

    let mut stmt = conn
        .prepare("SELECT * FROM pro_question")
        .expect("Getting all pro_questions failed.");
    let matched_questions = stmt
        .query_map([], |row| {
            Ok(ProQuestion {
                id: row.get(0)?,
                category: row.get(1)?,
                question: row.get(2)?,
                question_type: row.get(3)?,
                lowest_ranking: row.get(4)?,
                highest_ranking: row.get(5)?,
                lowest_label: row.get(6)?,
                highest_label: row.get(7)?,
            })
        })
        .expect("Converting DB pro_questions to struct failed.");

    let mut vec_to_return: Vec<ProQuestion> = vec![];

    for q in matched_questions {
        vec_to_return.push(q.unwrap());
    }

    return vec_to_return;
}
