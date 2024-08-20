// user.rs
// Ojos Project
//
// This handles a lot of user-related functions for Iris.
#![allow(dead_code)]
use crate::database::Database;
use crate::structs::{Medication, User};
use std::time::{SystemTime, UNIX_EPOCH};

fn is_none(o: Option<f64>) -> bool {
    match o {
        Some(_) => false,
        None => true,
    }
}

impl User {
    pub fn new(credential: String) -> Result<User, &'static str> {
        let mut db = Database::new();

        let user = db.user_exists(credential);

        match user {
            Ok(matched_user) => Ok(matched_user),
            Err(e) => Err(e),
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

#[cfg(test)]
mod tests {
    use crate::create_user;

    use super::*;
    use std::fs;

    #[test]
    fn test_upcoming_medications_all() {
        let mut john = create_user(
            "John Doe".to_string(),
            "PATIENT".to_string(),
            "12345".to_string(),
        );

        let mut db = Database::new();

        let mut zoloft =
            db.add_medication("Zoloft", "Zoloft", 25.0, 0.0, 25.0, None, "mg", None, None);
        zoloft.update_schedule(8.0, 12.0);

        let mut prozac =
            db.add_medication("Prozac", "Prozac", 25.0, 0.0, 25.0, None, "mg", None, None);
        prozac.update_schedule(6.0, 4.0);

        let mut wellbutrin = db.add_medication(
            "Wellbutrin",
            "Wellbutrin",
            25.0,
            0.0,
            25.0,
            None,
            "mg",
            None,
            None,
        );
        wellbutrin.update_schedule(8.0, 4.0);

        assert_eq!(john.get_upcoming_medications()[0].name, "Wellbutrin");
        assert_eq!(john.get_upcoming_medications()[1].name, "Prozac");
        assert_eq!(john.get_upcoming_medications()[2].name, "Zoloft");
    }
}
