// database.rs
// Ojos Project
// 
// This handles all of the database-related functions for Iris.
// Use this for reference: https://github.com/ojosproject/iris/tree/python
use rusqlite::{Connection, Result};

pub struct Database {
    connection: Connection,
    medication_cache: Vec<String>,
    last_cached: f64,
}

impl Database {
    pub fn new(path_to_db: &str) -> Database {
        let connection = Connection::open(path_to_db).expect("An error occurred.");
        Database {
            connection,
            medication_cache: vec![], //this creates an empty vector
            last_cached: 0.0,         // i'm not sure how we're implementing time
        }
    }

    // Jason
    pub fn med_in_db(&mut self, name: &str) -> bool {
        let mut stmt = self
            .connection
            .prepare("SELECT name FROM medication WHERE name = (name)", name);
        let mut rows = stmt.query(params![name]);

        true
    }

    // Jesse
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
        // todo: implement function
        // assuming connection is initialized properly

        // Change to using the actual connection, but for now, using a connection in memory
        // let conn = Connection::open_in_memory()?;

        self.connection.execute(
            "INSERT INTO medication (name, brand, dose, frequency, supply, first_added, last_taken)
        VALUES (?name, ?brand, ?dose, ?frequency, ?supply, ?first_added, ?last_taken)",
            (
                name,
                brand,
                dose,
                supply,
                first_added,
                last_taken,
                frequency,
            ),
        )?;

        // In the Python version we called a function to commit the change to the db and close the cursor that was returned by the execute function
        // Is this not relevant to this version in rust?

        Ok(())
    }

    // Jesse
    pub fn del_medication(&mut self, name: &str) -> Result<()> {
        // todo: implement function
        // Change to using the actual connection, but for now, using a connection in memory
        // let conn = Connection::open_in_memory()?;

        self.connection
            .execute("DELETE FROM medication WHERE name = ?name", (name,))?;

        Ok(())
    }

    // Jesse
    pub fn set_medication_dose(&mut self, name: &str, dose: &f64) -> Result<()> {
        // todo: add check to see if the medication name is in the DB, and raise error if not
        self.connection.execute(
            "UPDATE medication SET dose = ?dose WHERE name = ?name",
            (dose, name),
        )?;

        Ok(())
    }

    // Jesse
    pub fn set_medication_supply(&mut self, name: &str, supply: f64) -> Result<()> {
        // todo: add check to see if the medication name is in the DB, and raise error if not
        self.connection.execute(
            "UPDATE medication SET supply = ?supply WHERE name = ?name",
            (supply, name),
        )?;

        Ok(())
    }

    pub fn get_medications(include_only: Vec<String>, force_update_cache: bool) -> Vec<String> {
        // todo: implement function
        vec!["".to_string()]
    }



    pub fn log_medication(name: &str, dosage: &str, comments: Option<String>) -> f64 {
        // todo: implement function
        0.0
    }
}
