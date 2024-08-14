// user.rs
// Ojos Project
// 
// This handles a lot of user-related functions for Iris.
#![allow(dead_code)]
use crate::database::Database;
use crate::structs::{Medication, User};
use std::time::{SystemTime, UNIX_EPOCH};

impl User {
    pub fn new(credential: String) -> Result<User, &'static str> {
        let mut db = Database::new();

        let user = db.user_exists(credential);

        match user {
            Ok(matched_user) => {Ok(matched_user)}
            Err(e) => {Err(e)}
        }
    }

    pub fn create(name: String, type_of: String, credential: String) -> User {
        Database::new().create_user(name, type_of, credential)
    }

    pub fn get_medications(&mut self) -> Result<Vec<Medication>, String> {
        if self.type_of == "PATIENT" {
            Ok(Database::new().get_all_medications())
        } else {
            Err("This user is not a patient.".to_string())
        }
    }

    pub fn get_upcoming_medications(&mut self) -> Vec<Medication> {
        let time_right_now = SystemTime::now().duration_since(UNIX_EPOCH).expect("Time went backwards").as_secs_f64();
        let upcoming: Vec<Medication> = vec![];

        for med in self.get_medications().expect("Fetching medications failed.") {
            // todo: get upcoming 5 medications
            // todo: convert "frequency" into seconds ("every 6 hours" convert 6 hours into seconds)
            
        }

        upcoming
    }
}
