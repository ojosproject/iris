// pro.rs
// Ojos Project
//
// Functions for getting and modifying Patient Reported Outcomes.
// PROs are 
use crate::structs::PatientReportedOutcome;
use rusqlite::Connection;
use tauri::{AppHandle, Manager};

pub fn get_all_pros() -> Vec<PatientReportedOutcome> {
    let app_data_dir = app.path().app_data_dir().unwrap();
    let conn = Connection::open(app_data_dir.join("iris.db")).unwrap();

    let mut pros_list: Vec<PatientReportedOutcome> = vec![];

    let mut statement = conn
        .prepare("SELECT * FROM patient_recorded_outcome")
        .expect("Could not fetch PROs from database.");

    let matched_pros = statement
        .query_map([], |row| {
            Ok(PatientReportedOutcome {
                recorded_date: row.get(0)?,
                question: row.get(1)?,
                response: row.get(2)?,
            })
        })
        .expect("That did not work.");

    for pro in matched_pros {
        pros_list.push(pro.expect("ok"));
    }
    pros_list
}
