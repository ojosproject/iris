// specs.rs
// Ojos Project
//
// Stores care instructions
use crate::structs::CareInstruction;
use chrono::Local;
use rusqlite::{named_params, Connection};
use tauri::{AppHandle, Manager};

pub fn add_care_instruction(
    app: &AppHandle,
    title: String,
    content: String,
    frequency: Option<String>,
    added_by: String,
) -> CareInstruction {
    let app_data_dir = app.path().app_data_dir().unwrap();
    let conn = Connection::open(app_data_dir.join("iris.db")).unwrap();
    let ts = Local::now().timestamp();

    let ci = CareInstruction {
        title,
        content,
        frequency,
        added_by,
        last_updated: ts,
    };

    conn.execute("INSERT INTO care_instruction(title, content, frequency, added_by, last_updated) VALUES (?1, ?2, ?3, ?4, ?5)", (&ci.title, &ci.content, &ci.frequency, &ci.added_by, &ci.last_updated)).unwrap();
    ci
}

pub fn update_care_instructions(
    app: &AppHandle,
    title: String,
    content: String,
    frequency: Option<String>,
    added_by: String,
) -> CareInstruction {
    let app_data_dir = app.path().app_data_dir().unwrap();
    let conn = Connection::open(app_data_dir.join("iris.db")).unwrap();
    let ts = Local::now().timestamp();

    let ci = CareInstruction {
        title,
        content,
        frequency,
        added_by,
        last_updated: ts,
    };

    conn.execute(
        "UPDATE care_instruction SET title=:title, content=:content, frequency=:frequency, added_by=:added_by, last_updated=:last_updated WHERE title=:title",
        named_params! {
            ":title": &ci.title,
            ":content": &ci.content,
            ":frequency": &ci.frequency,
            ":added_by": &ci.added_by,
            ":last_updated": &ci.last_updated
        },
    )
    .unwrap();

    ci
}

pub fn get_all_care_instructions(app: &AppHandle) -> Vec<CareInstruction> {
    let app_data_dir = app.path().app_data_dir().unwrap();
    let conn = Connection::open(app_data_dir.join("iris.db")).unwrap();

    let mut stmt = conn
        .prepare("SELECT * FROM care_instruction ORDER BY last_updated DESC")
        .unwrap();
    let matched_ci = stmt
        .query_map([], |row| {
            Ok(CareInstruction {
                title: row.get(0)?,
                content: row.get(1)?,
                frequency: row.get(2)?,
                added_by: row.get(3)?,
                last_updated: row.get(4)?,
            })
        })
        .unwrap();

    let mut vec_to_return: Vec<CareInstruction> = vec![];
    for ci in matched_ci {
        vec_to_return.push(ci.unwrap());
    }

    vec_to_return
}
