// medications.rs
// Ojos Project
// 
// This handles a lot of medication-related functions.
#![allow(dead_code)]
use crate::database::Database;
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize)]
pub struct Medication {
    pub name: String,
    pub brand: String,
    pub dosage: f64,
    pub frequency: Option<f64>,
    pub supply: Option<f64>,
    pub first_added: Option<f64>,
    pub last_taken: Option<f64>,
    pub measurement: String,
    pub upcoming_dose: Option<f64>,
    pub schedule: Option<String>
}

impl Medication {
    pub fn log(&mut self, comments: Option<String>) -> f64 {
        // returns the timestamp of the log
        let mut db = Database::new();
        

        self.last_taken = Some(db.log_medication(
            self.name.as_str(),
            self.dosage,
            comments,
        ));

        self.last_taken.expect("Last taken was not found even though it was set...")
    }

    pub fn update_dose(&mut self, value: f64) {
        let mut db = Database::new();
        self.dosage = value;

        db.set_medication_dose(&self.name, self.dosage).expect("Updating the dosage did not work.");
        
    }

    pub fn update_supply(&mut self, value: f64) {
        self.supply = Some(value);

        let mut db = Database::new();
        db.set_medication_supply(&self.name, value).expect("Updating the supply did not work.");
    }

    pub fn create_schedule(&mut self, mut initial_dose : f64, interval : f64) -> String {
        // this assumes that interval is a factor of 24(1, 2, 3, 4, 6, 8, 12, 24), meaning it will eventually get back to the initial dose provided. idk what to do if it isn't
        // ? If you input whole numbers, i.e. 8.0, then it will return integers (1,2,3,4)
        let mut schedule_vec : Vec<String> = vec![];
        schedule_vec.push(initial_dose.to_string());
        let mut next_dosage;
        for _ in 0..((24.0 / interval) as i32 - 1){
            if initial_dose + interval < 24.1{
                next_dosage = initial_dose + interval;
                }
            else{
                next_dosage = (initial_dose + interval) - 24.0;
                }
            schedule_vec.push(next_dosage.to_string());
            initial_dose = next_dosage;
        }

        schedule_vec.join(",")
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
            schedule: None
        };

        assert_eq!(m.create_schedule(8.0, 6.0), "8,14,20,2");
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
            schedule: None
        };

        assert_eq!(m.create_schedule(8.5, 6.0), "8.5,14.5,20.5,2.5");
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
            schedule: None
        };

        assert_eq!(m.create_schedule(8.5, 24.0), "8.5");
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
        if res.len() == 1 { assert_eq!(res[0].comment, Some("This is a comment.".to_string())) }
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