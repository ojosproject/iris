// pro.rs
// Ojos Project
//
// Functions for getting and modifying Patient Reported Outcomes.
// PROs are
use super::structs::PatientReportedOutcome;
use rusqlite::{named_params, Connection};
use std::time::SystemTime;
use tauri::{AppHandle, Manager};
use uuid::Uuid;

pub fn get_all_pros(app: AppHandle) -> Vec<PatientReportedOutcome> {
    let app_data_dir = app.path().app_data_dir().unwrap();
    let conn = Connection::open(app_data_dir.join("iris.db")).unwrap();

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

pub fn add_pros(app: AppHandle, pros: Vec<(String, i32)>) {
    let app_data_dir = app.path().app_data_dir().unwrap();
    let conn = Connection::open(app_data_dir.join("iris.db")).unwrap();

    let recorded_date: i64 = SystemTime::now()
        .duration_since(SystemTime::UNIX_EPOCH)
        .unwrap()
        .as_secs() as i64;
    for pro_tuple in pros {
        // INSERT OR IGNORE will skip an insertion if a primary or unique constraint
        // is failed.
        conn.execute(
            "INSERT INTO patient_recorded_outcome (id, recorded_date, question, response) VALUES (:uuid, :recorded_date, :question, :response)", 
            named_params! {":uuid": Uuid::new_v4().to_string(), ":recorded_date": i64::try_from(recorded_date).unwrap(), ":question": pro_tuple.0, ":response": i64::try_from(pro_tuple.1).unwrap()}
        ).expect("Inserting into patient_recorded_outcome failed.");
    }
}
