// database.rs
// Ojos Project
// 
// This handles all of the database-related functions for Iris.
// Use this for reference: https://github.com/ojosproject/iris/tree/python
#![allow(dead_code)] // ! Remove after we start working in `main.rs`

use rusqlite::{Connection, Result, named_params};
use std::{fs, path::Path, time::{SystemTime, UNIX_EPOCH}};
use crate::medications::Medication;

fn create_database(file_path: &str) {
    let connection = Connection::open(file_path).expect("Failed to open the database.");
    connection.execute_batch(fs::read_to_string("./src/schema.sql").expect("Reading the schema file failed.").as_str()).expect("Creating the file from SQL Schema failed.")
}

pub struct Database {
    connection: Connection,
    medication_cache: Vec<String>,
    last_cached: f64,
}

impl Database {
    pub fn new(path: &str) -> Database {
        if !Path::new(path).exists() {
            create_database(path);
        }
        let connection = Connection::open(path).expect("Failed to open the database.");
        Database {
            connection,
            medication_cache: vec![], //this creates an empty vector
            last_cached: 0.0,         // i'm not sure how we're implementing time
        }
    }

    fn med_in_db(&mut self, name: &str) -> bool {
        // if at least 1 with the name is in the database, it exists
        self.connection.execute("SELECT name FROM medication WHERE name = ?name", (name,)).into_iter().len() > 0
    }


    pub fn add_medication(
        &mut self,
        name: &str,
        brand: &str,
        dose: i64,
        supply: i64,
        first_added: i64,
        last_taken: i64,
        frequency: Option<String>,
    ) -> Result<()> {
        // assuming connection is initialized properly

        // Change to using the actual connection, but for now, using a connection in memory
        // let conn = Connection::open_in_memory()?;

        self.connection.execute(
            "INSERT INTO medication (name, brand, dose, frequency, supply, first_added, last_taken)
        VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7)",
            (
                name,
                brand,
                dose,
                frequency,
                supply,
                first_added,
                last_taken,
            ),
        )?;

        // In the Python version we called a function to commit the change to the db and close the cursor that was returned by the execute function
        // Is this not relevant to this version in rust?

        Ok(())
    }

    pub fn del_medication(&mut self, name: &str) -> Result<()> {
        // todo: testing required
        // Change to using the actual connection, but for now, using a connection in memory
        // let conn = Connection::open_in_memory()?;

        self.connection
            .execute("DELETE FROM medication WHERE name = ?name", (name,))?;

        Ok(())
    }

    pub fn set_medication_dose(&mut self, name: &str, dose: &f64) -> Result<()> {
        // todo: testing required
        self.connection.execute(
            "UPDATE medication SET dose = ?dose WHERE name = ?name",
            (dose, name),
        )?;

        Ok(())
    }

    pub fn set_medication_supply(&mut self, name: &str, supply: f64) -> Result<()> {
        // todo: testing required
        self.connection.execute(
            "UPDATE medication SET supply = ?supply WHERE name = ?name",
            (supply, name),
        )?;

        Ok(())
    }

    pub fn get_all_medications(&mut self) -> Vec<Medication> {
        // todo: do actual error handling
        // ! DO NOT LEAVE IN PRODUCTION WITHOUT ERROR HANDLING
        let mut statement = self.connection.prepare(
                    "SELECT * FROM medication").expect("This did not work!"
                    );

        let matched_medications = statement.query_map([], |row| {
            Ok(Medication {
                name: row.get(0)?,
                brand: row.get(1)?,
                dosage: row.get(2)?,
                frequency: row.get(3)?,
                supply: row.get(4)?,
                first_added: row.get(5)?,
                last_taken: row.get(6)?
            })
        }).expect("That did not work.");

        let mut vec_to_return: Vec<Medication> = vec![];

        for med in matched_medications {
            vec_to_return.push(med.expect("ok"));
        }

        return vec_to_return;
    }

    pub fn search_medications(&mut self, query: &str) -> Vec<Medication> {
        // todo: do actual error handling
        // ! DO NOT LEAVE IN PRODUCTION WITHOUT ERROR HANDLING
        let mut statement  = self.connection.prepare(
                    // https://github.com/rusqlite/rusqlite/issues/600#issuecomment-562258168
                    "SELECT * FROM medication WHERE name LIKE '%' || ? || '%'"
                ).expect("This did not work!");
        

        let matched_medications = statement.query_map([query], |row| {
            Ok(Medication {
                name: row.get(0)?,
                brand: row.get(1)?,
                dosage: row.get(2)?,
                frequency: row.get(3)?,
                supply: row.get(4)?,
                first_added: row.get(5)?,
                last_taken: row.get(6)?
            })
        }).expect("That did not work.");

        let mut vec_to_return: Vec<Medication> = vec![];

        for med in matched_medications {
            vec_to_return.push(med.expect("ok"));
        }

        return vec_to_return;
    }



    pub fn log_medication(&mut self, name: &str, dosage: &str, comments: Option<String>) -> f64 {
        // todo: testing required
        let timestamp = SystemTime::now().duration_since(UNIX_EPOCH).expect("Time went backwards").as_secs_f64();
        
        self.connection.execute(
            "INSERT INTO medication_log (name, dosage, comments) VALUES (:timestamp, :name, :dose, :comments)", 
            named_params! {":timestamp": timestamp, ":name": name, ":dose": dosage, ":comments": comments}
        ).expect("Inserting into log_medication failed.");
        return timestamp;
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
    fn starts_empty() {
        let path = "./iris-starts-empty.db";

        let mut d = Database::new(path);
        assert_eq!(d.get_all_medications().len(), 0);
        fs::remove_file(path).expect("Deleting the file failed.");
    }

    #[test]
    fn medication_successfully_added() {
        let path = "./iris-medication-successfully-added.db";

        let mut d = Database::new(path);
        d.add_medication("Zoloft", "Zoloft", 25, 20, 0, 0, Some("Once daily".to_string())).expect("Adding the medication failed.");

        assert_eq!(d.search_medications("Zoloft").len(), 1);
        fs::remove_file(path).expect("Deleting the file failed.");
    }
}
