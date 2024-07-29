// medications.rs
// Ojos Project
// 
// This handles a lot of medication-related functions.
#![allow(dead_code)] // ! Remove after we start working in `main.rs`

use crate::database::Database;

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

    pub fn log(&mut self, comments: Option<String>) {
        let mut db = Database::new("./iris.db");

        self.last_taken = Some(db.log_medication(
            self.name.to_string(),
            self.dosage.to_string(),
            comments,
        ))
    }

    pub fn update_dose(&mut self, value: f64) {
        let mut db = Database::new("./iris.db");
        self.dosage = value;

        db.set_medication_dose(&self.name, &self.dosage).expect("Updating the dosage did not work.");
        
    }

    pub fn update_supply(&mut self, value: f64) {
        self.dosage = value;

        let mut db = Database::new("./iris.db");
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
}
