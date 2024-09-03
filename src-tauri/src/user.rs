// user.rs
// Ojos Project
//
// This handles a lot of user-related functions for Iris.
#![allow(dead_code)]
use crate::database::Database;
use crate::structs::{Medication, User};

fn is_none(o: Option<f64>) -> bool {
    match o {
        Some(_) => false,
        None => true,
    }
}

impl User {
    pub fn new(full_name: String) -> Result<User, &'static str> {
        let mut db = Database::new();

        let user = db.user_exists(full_name);

        match user {
            Ok(matched_user) => Ok(matched_user),
            Err(e) => Err(e),
        }
    }

    pub fn create(name: String, type_of: String) -> User {
        Database::new().create_user(name, type_of)
    }

    pub fn get_medications(&mut self) -> Result<Vec<Medication>, String> {
        if self.type_of == "PATIENT" {
            Ok(Database::new().get_all_medications())
        } else {
            Err("This user is not a patient.".to_string())
        }
    }

    pub fn get_upcoming_medications(&mut self) -> Vec<Medication> {
        let mut returning_medications: Vec<Medication> = vec![];

        for med in self.get_medications().unwrap() {
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
}
