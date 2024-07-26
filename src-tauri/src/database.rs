// database.rs
// Ojos Project
// 
// This handles all of the database-related functions for Iris.
// Use this for reference: https://github.com/ojosproject/iris/tree/python
use rusqlite::{Connection, Result, named_params};
use std::time::{SystemTime, UNIX_EPOCH};
use crate::medications::Medication;

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

    pub fn del_medication(&mut self, name: &str) -> Result<()> {
        // todo: implement function
        // Change to using the actual connection, but for now, using a connection in memory
        // let conn = Connection::open_in_memory()?;

        self.connection
            .execute("DELETE FROM medication WHERE name = ?name", (name,))?;

        Ok(())
    }

    pub fn set_medication_dose(&mut self, name: &str, dose: &f64) -> Result<()> {
        // todo: add check to see if the medication name is in the DB, and raise error if not
        self.connection.execute(
            "UPDATE medication SET dose = ?dose WHERE name = ?name",
            (dose, name),
        )?;

        Ok(())
    }

    pub fn set_medication_supply(&mut self, name: &str, supply: f64) -> Result<()> {
        // todo: add check to see if the medication name is in the DB, and raise error if not
        self.connection.execute(
            "UPDATE medication SET supply = ?supply WHERE name = ?name",
            (supply, name),
        )?;

        Ok(())
    }

    pub fn get_medications(&mut self, query: &str) -> Vec<Medication> {
        // todo: do actual error handling
        // ! DO NOT LEAVE IN PRODUCTION WITHOUT ERROR HANDLING
        let mut statement = self.connection.prepare(
            "SELECT * FROM medication WHERE name LIKE %?query%".replace("?query", query).as_str()
        ).expect("This did not work!");

        let matched_meds = statement.query_map([], |row| {
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

        for med in matched_meds {
            vec_to_return.push(med.expect("ok"));
        }

        return vec_to_return;
    }



    pub fn log_medication(&mut self, name: &str, dosage: &str, comments: Option<String>) -> f64 {
        let timestamp = SystemTime::now().duration_since(UNIX_EPOCH).expect("Time went backwards").as_secs_f64();
        
        let insertion = self.connection.execute(
            "INSERT INTO medication_log (name, dosage, comments) VALUES (:timestamp, :name, :dose, :comments)", 
            named_params! {":timestamp": timestamp, ":name": name, ":dose": dosage, ":comments": comments}
        );
        return timestamp;
    }
}
