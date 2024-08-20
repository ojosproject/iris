// medications.rs
// Ojos Project
//
// This handles a lot of medication-related functions.
#![allow(dead_code)]
use crate::database::Database;
use crate::structs::Medication;
use chrono::{DateTime, Utc};

impl Medication {
    pub fn log(&mut self, comments: Option<String>) -> f64 {
        // returns the timestamp of the log
        let mut db = Database::new();

        self.last_taken = Some(db.log_medication(self.name.as_str(), self.dosage, comments));

        self.last_taken
            .expect("Last taken was not found even though it was set...")
    }

    pub fn update_dose(&mut self, value: f64) {
        let mut db = Database::new();
        self.dosage = value;

        db.set_medication_dose(&self.name, self.dosage)
            .expect("Updating the dosage did not work.");
    }

    pub fn update_supply(&mut self, value: f64) {
        self.supply = Some(value);

        let mut db = Database::new();
        db.set_medication_supply(&self.name, value)
            .expect("Updating the supply did not work.");
    }

    fn set_upcoming_dose(&mut self, new_upcoming_dose: Option<&f64>) {
        // If `new_upcoming_dose` is set to None, it'll calculate when the next dose is needed
        // based off of medication_log
        // ! new_upcoming_dose is set to 0-23

        // the end result will be a unix timestamp. we can find this by finding the current time of day and seeing when the next time to take a medication is based on the
        // schedule. The final unix timestamp will be calculated as current time + time until next

        let now = Utc::now();
        let split_schedule = self.schedule.clone().unwrap().split(",");

        match new_upcoming_dose {
            Some(dose) => {
                // find unix timestamp of today with that time
                for num in split_schedule {
                    //DateTime::from
                }
            }
            None => {
                // find unix timestamp using medication_log
            }
        }
    }

    pub fn update_schedule(&mut self, mut initial_dose: f64, interval: f64) -> String {
        // initial dose: 0-23
        // interval: 1-24
        // ? If you input whole numbers, i.e. 8.0, then it will return integers (1,2,3,4)
        let mut schedule_vec: Vec<String> = vec![];
        schedule_vec.push(initial_dose.to_string());
        let mut next_dosage;

        self.set_upcoming_dose(Some(&initial_dose));

        for _ in 0..((24.0 / interval) as i32 - 1) {
            if initial_dose + interval < 24.1 {
                next_dosage = initial_dose + interval;
            } else {
                next_dosage = (initial_dose + interval) - 24.0;
            }
            schedule_vec.push(next_dosage.to_string());
            initial_dose = next_dosage;
        }

        self.schedule = Some(schedule_vec.join(","));
        Database::new().set_medication_schedule(&self.name, &self.schedule.clone().unwrap());

        self.schedule.clone().unwrap()

        //I'm unsure how to handle what we're passing around (String vs &String)
        //should create_schedule still return something? If not, we should fix our tests
    }
}

// Unit tests
#[cfg(test)]
mod tests {
    // Note about testing:
    // I'm searching for a way to initialize testing with creating a fresh
    // database. However, I don't think I can find Rust's way of a "setup"
    // method for testing. So I'm going to keep searching. Until then,
    // ! please delete any `.db` file inside of /src-tauri/ before testing.
    use super::*;
    use std::fs;

    #[test]
    fn test_schedule_creation() {
        let mut m = Medication {
            name: "Zoloft".to_string(),
            brand: "Zoloft".to_string(),
            dosage: 50.0,
            frequency: None,
            supply: None,
            first_added: None,
            last_taken: None,
            measurement: "mg".to_string(),
            upcoming_dose: None,
            schedule: None,
        };

        assert_eq!(m.update_schedule(8.0, 6.0), "8,14,20,2");
    }

    #[test]
    fn test_schedule_created_with_half_hours() {
        let mut m = Medication {
            name: "Zoloft".to_string(),
            brand: "Zoloft".to_string(),
            dosage: 50.0,
            frequency: None,
            supply: None,
            first_added: None,
            last_taken: None,
            measurement: "mg".to_string(),
            upcoming_dose: None,
            schedule: None,
        };

        assert_eq!(m.update_schedule(8.5, 6.0), "8.5,14.5,20.5,2.5");
    }

    #[test]
    fn test_schedule_created_every_24_hours() {
        let mut m = Medication {
            name: "Zoloft".to_string(),
            brand: "Zoloft".to_string(),
            dosage: 50.0,
            frequency: None,
            supply: None,
            first_added: None,
            last_taken: None,
            measurement: "mg".to_string(),
            upcoming_dose: None,
            schedule: None,
        };

        assert_eq!(m.update_schedule(8.5, 24.0), "8.5");
    }
}
/*
    #[test]
    fn can_get_value() {
        let m = Medication::new("Zoloft", "Zoloft", 50.0, None, None, None, None, "mg", None, None);

        assert_eq!(m.name, "Zoloft");
        assert_eq!(m.brand, "Zoloft");
        assert_eq!(m.dosage, 50.0);
    }

    fn can_set_value() {
        let mut m = Medication::new("Zoloft", "Zoloft", 50.0, None, None, None, None, "mg", None, None);
        m.dosage = 35.0;
    }

    #[test]
    fn logs_medications_without_comments() {
        let mut m = Medication::new("Zoloft", "Zoloft", 50.0, None, None, None, None, "mg", None, None);
        let d = Database::new();

        m.log(None); // no comments

        let res = d.get_medication_log("Zoloft");
        assert_eq!(res.len(), 1);
        fs::remove_file("./iris.db").expect("Deleting the file failed.");
    }

    #[test]
    fn logs_medications_with_comments() {
        let mut m = Medication::new("Zoloft", "Zoloft", 50.0, None, None, None, None, "mg", None, None);
        let d = Database::new();

        m.log(Some("This is a comment.".to_string())); // no comments

        let res = d.get_medication_log("Zoloft");
        if res.len() == 1 {
            assert_eq!(res[0].comment, Some("This is a comment.".to_string()))
        }
        fs::remove_file("./iris.db").expect("Deleting the file failed.");
    }

    #[test]
    fn successfully_updates_dose() {
        let mut m = Medication::new("Zoloft", "Zoloft", 50.0, None, None, None, None, "mg", None, None);
        m.update_dose(20.0);

        assert_eq!(m.dosage, 20.0);
    }

    #[test]
    fn successfully_updates_supply() {
        let mut m = Medication::new("Zoloft", "Zoloft", 50.0, None, None, None, None, "mg", None, None);
        m.update_supply(99.0);

        assert_eq!(m.supply, Some(99.0));
    }
}
 */
