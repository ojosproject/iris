// database.rs
// Ojos Project
// 
// This handles all of the database-related functions for Iris.
// Use this for reference: https://github.com/ojosproject/iris/tree/python
use rusqlite::{Connection, Result};

static CONNECTION: Option<String> = None;
static MEDICATION_CACHE: Option<Vec<String>> = None;
static LAST_CACHED: Option<f64> = None;

// add your name
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

// Jesse
pub fn add_medication(name: &str, brand: &str, dose: i64, supply: i64, first_added: i64, last_taken: i64, frequency: Option<String>) -> Result<()>{
    // todo: implement function
    // assuming connection is initialized properly
    
    // Change to using the actual connection, but for now, using a connection in memory
    let conn = Connection::open_in_memory()?;

    conn.execute(
        "INSERT INTO medication (name, brand, dose, frequency, supply, first_added, last_taken)
        VALUES (?name, ?brand, ?dose, ?frequency, ?supply, ?first_added, ?last_taken)",
                (name, brand, dose, supply, first_added, last_taken, frequency)
    )?;

    // In the Python version we called a function to commit the change to the db and close the cursor that was returned by the execute function
    // Is this not relevant to this version in rust?

    Ok(())
}

// Jesse
pub fn del_medication(name: &str) -> Result<()> {
    // todo: implement function
    // Change to using the actual connection, but for now, using a connection in memory
    let conn = Connection::open_in_memory()?;

    conn.execute(
        "DELETE FROM medication WHERE name = ?name", (name,)
    )?;

    Ok(())
}

pub fn log_medication(name: &str, dosage: &str, comments: Option<String>) -> f64 {
    // todo: implement function
    0.0
}
