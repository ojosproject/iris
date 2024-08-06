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
    pub frequency: Option<String>,
    pub supply: Option<f64>,
    pub first_added: Option<f64>,
    pub last_taken: Option<f64>,
    pub measurement: String,
}

impl Medication {
    pub fn new(name: &str, brand: &str, dosage: f64, frequency: Option<&str>, supply: Option<f64>, first_added: Option<f64>, last_taken: Option<f64>, measurement: &str) -> Medication {
        Medication {
            name: name.to_string(),
            brand: brand.to_string(),
            dosage,
            frequency: match frequency {
                Some(f) => {Some(f.to_string())}
                None => {None}
            },
            supply,
            first_added,
            last_taken,
            measurement: measurement.to_string(),
        }
    }

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
    fn can_get_value() {
        let m = Medication::new("Zoloft", "Zoloft", 50.0, None, None, None, None, "mg");
        
        assert_eq!(m.name, "Zoloft");
        assert_eq!(m.brand, "Zoloft");
        assert_eq!(m.dosage, 50.0);
    }

    fn can_set_value() {
        let mut m = Medication::new("Zoloft", "Zoloft", 50.0, None, None, None, None, "mg");
        m.dosage = 35.0;
    }

    #[test]
    fn logs_medications_without_comments() {
        let mut m = Medication::new("Zoloft", "Zoloft", 50.0, None, None, None, None, "mg");
        let d = Database::new();

        m.log(None); // no comments

        let res = d.get_medication_log("Zoloft");
        assert_eq!(res.len(), 1);
        fs::remove_file("./iris.db").expect("Deleting the file failed.");
    }

    #[test]
    fn logs_medications_with_comments() {
        let mut m = Medication::new("Zoloft", "Zoloft", 50.0, None, None, None, None, "mg");
        let d = Database::new();

        m.log(Some("This is a comment.".to_string())); // no comments

        let res = d.get_medication_log("Zoloft");
        if res.len() == 1 { assert_eq!(res[0].comment, Some("This is a comment.".to_string())) }
        fs::remove_file("./iris.db").expect("Deleting the file failed.");
    }

    #[test]
    fn successfully_updates_dose() {
        let mut m = Medication::new("Zoloft", "Zoloft", 50.0, None, None, None, None, "mg");
        m.update_dose(20.0);
        
        assert_eq!(m.dosage, 20.0);
    }
    
    #[test]
    fn successfully_updates_supply() {
        let mut m = Medication::new("Zoloft", "Zoloft", 50.0, None, None, None, None, "mg");
        m.update_supply(99.0);
        
        assert_eq!(m.supply, Some(99.0));
    }
}
