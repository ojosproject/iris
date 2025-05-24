// File:     pro/commands.rs
// Purpose:  Commands for the Patient Reported Outcomes tool.
// Authors:  Ojos Project & Iris contributors
// License:  GNU General Public License v3.0
use super::structs::PatientReportedOutcome;
use super::structs::ProQuestion;
use crate::helpers::{db_connect, stamp};
use rusqlite::named_params;
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
    let conn = db_connect(&app);

    for pro_tuple in pros {
        let (timestamp, uuid) = stamp();
        // INSERT OR IGNORE will skip an insertion if a primary or unique constraint
        // is failed.
        conn.execute(
            "INSERT INTO patient_recorded_outcome (id, recorded_date, question, response) VALUES (:uuid, :recorded_date, :question, :response)", 
            named_params! {":uuid": uuid, ":recorded_date": timestamp, ":question": pro_tuple.0, ":response": i64::try_from(pro_tuple.1).unwrap()}
        ).expect("Inserting into patient_recorded_outcome failed.");
    }
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
    let conn = db_connect(&app);

    let mut pros_list: Vec<PatientReportedOutcome> = vec![];

    let mut statement = conn
        .prepare("SELECT * FROM patient_recorded_outcome")
        .expect("Could not fetch PROs from database.");

    let matched_pros = statement
        .query_map([], |row| {
            Ok(PatientReportedOutcome {
                id: row.get(0)?,
                recorded_date: row.get(1)?,
                question: row.get(2)?,
                response: row.get(3)?,
            })
        })
        .unwrap();

    for pro in matched_pros {
        pros_list.push(pro.unwrap());
    }
    pros_list
}

#[tauri::command(rename_all = "snake_case")]
pub fn get_pro_questions(app: AppHandle) -> Vec<ProQuestion> {
    let conn = db_connect(&app);

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
