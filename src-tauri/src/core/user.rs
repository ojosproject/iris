// user.rs
// Ojos Project
//
// This handles a lot of user-related functions for Iris.
#![allow(dead_code)]
use crate::core::structs::User;
use rusqlite::{named_params, Connection};
use tauri::{AppHandle, Manager};
use uuid::Uuid;

// ! Some functions are missing and existed in the old `database.rs` file.
// ! https://github.com/ojosproject/iris/blob/41a988f4788bd18f844836f71de17645639dc137/src-tauri/src/database.rs

pub fn get_patient(app: AppHandle) -> User {
    let app_data_dir = app.path().app_data_dir().unwrap();
    let conn = Connection::open(app_data_dir.join("iris.db")).unwrap();

    let mut stmt = conn
        .prepare("SELECT * FROM user WHERE type = 'PATIENT'")
        .unwrap();

    let mut matched_user = stmt
        .query_map([], |row| {
            Ok(User {
                id: row.get(0).unwrap(),
                full_name: row.get(1).unwrap(),
                type_of: row.get(2).unwrap(),
                email: None,
                phone_number: None,
            })
        })
        .unwrap();

    matched_user.next().unwrap().unwrap()
}

pub fn get_user(app: AppHandle, id: String) -> User {
    let app_data_dir = app.path().app_data_dir().unwrap();
    let conn = Connection::open(app_data_dir.join("iris.db")).unwrap();

    let mut stmt = conn
        .prepare("SELECT * FROM user WHERE type = 'NURSE' AND id = :nurse_id")
        .unwrap();

    let mut matched_user = stmt
        .query_map(named_params! {":nurse_id": id}, |row| {
            Ok(User {
                id: row.get(0).unwrap(),
                full_name: row.get(1).unwrap(),
                type_of: row.get(2).unwrap(),
                phone_number: row.get(3).unwrap(),
                email: row.get(4).unwrap(),
            })
        })
        .unwrap();

    matched_user.next().unwrap().unwrap()
}

impl User {
    pub fn create(app: AppHandle, name: String, type_of: String) -> Self {
        let app_data_dir = app.path().app_data_dir().unwrap();
        let conn = Connection::open(app_data_dir.join("iris.db")).unwrap();
        let new_user_id = Uuid::new_v4().to_string();

        let user = User {
            id: new_user_id,
            full_name: name,
            type_of,
            email: None,
            phone_number: None,
        };

        conn.execute(
            "INSERT INTO user (id, full_name, type) VALUES (?1, ?2, ?3)",
            (&user.id, &user.full_name, &user.type_of),
        )
        .unwrap();

        user
    }
}
