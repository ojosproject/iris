// user.rs
// Ojos Project
//
// This handles a lot of user-related functions for Iris.
#![allow(dead_code)]
use crate::structs::{Medication, User};
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
                phone_number: row.get(3).unwrap(),
                email: row.get(4).unwrap(),
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

fn is_none(o: Option<f64>) -> bool {
    match o {
        Some(_) => false,
        None => true,
    }
}

impl User {
    pub fn create(
        app: AppHandle,
        name: String,
        type_of: String,
        phone_number: Option<i64>,
        email: Option<String>,
    ) -> Self {
        let app_data_dir = app.path().app_data_dir().unwrap();
        let conn = Connection::open(app_data_dir.join("iris.db")).unwrap();
        let new_user_id = Uuid::new_v4().to_string();

        let user = User {
            id: new_user_id,
            full_name: name,
            type_of,
            phone_number,
            email,
        };

        conn.execute(
            "INSERT INTO user (id, full_name, type) VALUES (?1, ?2, ?3)",
            (&user.id, &user.full_name, &user.type_of),
        )
        .unwrap();

        user
    }

    pub fn get_medications(&mut self, app: AppHandle) -> Vec<Medication> {
        let app_data_dir = app.path().app_data_dir().unwrap();
        let conn = Connection::open(app_data_dir.join("iris.db")).unwrap();

        let mut statement = conn
            .prepare("SELECT * FROM medication")
            .expect("This did not work!");

        let matched_medications = statement
            .query_map([], |row| {
                Ok(Medication {
                    name: row.get(0)?,
                    brand: row.get(1)?,
                    dosage: row.get(2)?,
                    frequency: row.get(3)?,
                    supply: row.get(4)?,
                    first_added: row.get(5)?,
                    last_taken: row.get(6)?,
                    upcoming_dose: row.get(7)?,
                    schedule: row.get(8)?,
                    measurement: row.get(9)?,
                    nurse_id: row.get(10)?,
                })
            })
            .expect("That did not work.");

        let mut vec_to_return: Vec<Medication> = vec![];

        for med in matched_medications {
            vec_to_return.push(med.expect("ok"));
        }

        return vec_to_return;
    }

    pub fn get_upcoming_medications(&mut self, app: AppHandle) -> Vec<Medication> {
        let mut returning_medications: Vec<Medication> = vec![];

        for med in self.get_medications(app) {
            if !is_none(med.upcoming_dose) {
                returning_medications.push(med);
            }
        }

        returning_medications.sort_by(|med_a, med_b| {
            med_a
                .upcoming_dose
                .unwrap()
                .total_cmp(&med_b.upcoming_dose.unwrap())
        });

        returning_medications
    }

    pub fn search_medications(&mut self, app: AppHandle, query: &str) -> Vec<Medication> {
        let app_data_dir = app.path().app_data_dir().unwrap();
        let conn = Connection::open(app_data_dir.join("iris.db")).unwrap();

        // https://github.com/rusqlite/rusqlite/issues/600#issuecomment-562258168
        let mut stmt = conn
            .prepare("SELECT * FROM medication WHERE name LIKE '%' || ? || '%'")
            .unwrap();

        let matched_medications = stmt
            .query_map([query], |row| {
                Ok(Medication {
                    name: row.get(0)?,
                    brand: row.get(1)?,
                    dosage: row.get(2)?,
                    frequency: row.get(3)?,
                    supply: row.get(4)?,
                    first_added: row.get(5)?,
                    last_taken: row.get(6)?,
                    upcoming_dose: row.get(7)?,
                    schedule: row.get(8)?,
                    measurement: row.get(9)?,
                    nurse_id: row.get(10)?,
                })
            })
            .unwrap();

        let mut vec_to_return: Vec<Medication> = vec![];

        for med in matched_medications {
            vec_to_return.push(med.unwrap());
        }

        vec_to_return
    }
}
