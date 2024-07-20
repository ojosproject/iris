// database.rs
// Ojos Project
// 
// This handles all of the database-related functions for Iris.

pub mod database {
    static CONNECTION: Option<String> = None;
    static MEDICATION_CACHE: Option<Vec<String>> = None;
    static LAST_CACHED: Option<f64> = None;

    fn med_in_db(name: &str) -> bool {
        // todo: implement function
        true
    }

    fn update_cache() {
        // todo: implement function
    }

    pub fn get_medications(include_only: Vec<String>, force_update_cache: bool) -> Vec<String> {
        // todo: implement function
        vec!["".to_string()]
    }

    pub fn set_medication_dose(name: &str, dose: &f64) {
        // todo: implement function
    }

    pub fn set_medication_supply(name: &str, supply: f64) {
        // todo: implement function
    }

    pub fn add_medication(name: &str, brand: &str, dose: i64, supply: i64, first_added: i64, last_taken: i64, frequency: Option<String>) {
        // todo: implement function
    }

    pub fn del_medication(name: &str) {
        // todo: implement function
    }

    pub fn log_medication(name: &str, dosage: &str, comments: Option<String>) -> f64 {
        // todo: implement function
        0.0
    }
}
