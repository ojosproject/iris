// specs.rs
// Ojos Project
//
// Stores care instructions
use crate::structs::CareInstruction;
use chrono::Local;
use rusqlite::Connection;
use tauri::{AppHandle, Manager};

pub fn add_care_instruction(
    app: &AppHandle,
    text: String,
    readable_frequency: String,
    added_by: String,
) -> CareInstruction {
    let app_data_dir = app.path().app_data_dir().unwrap();
    let conn = Connection::open(app_data_dir.join("iris.db")).unwrap();
    let ts = Local::now().timestamp();

    let ci = CareInstruction {
        text,
        frequency: readable_frequency,
        added_by,
        first_added: ts,
    };

    conn.execute("INSERT INTO care_instruction(text, frequency, added_by, first_added) VALUES ?1, ?2, ?3, ?4", (&ci.text, &ci.frequency, &ci.added_by, &ci.first_added)).unwrap();
    ci
}

pub fn get_all_care_instructions(app: &AppHandle) -> Vec<CareInstruction> {
    let app_data_dir = app.path().app_data_dir().unwrap();
    let conn = Connection::open(app_data_dir.join("iris.db")).unwrap();

    let mut stmt = conn.prepare("SELECT * FROM care_instruction").unwrap();
    let matched_ci = stmt
        .query_map([], |row| {
            Ok(CareInstruction {
                text: row.get(0)?,
                frequency: row.get(1)?,
                added_by: row.get(2)?,
                first_added: row.get(3)?,
            })
        })
        .unwrap();

    let mut vec_to_return: Vec<CareInstruction> = vec![];
    for ci in matched_ci {
        vec_to_return.push(ci.unwrap());
    }

    vec_to_return
}
