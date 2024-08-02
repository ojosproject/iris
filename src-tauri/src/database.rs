// database.rs
// Ojos Project
// 
// This handles all of the database-related functions for Iris.
// Use this for reference: https://github.com/ojosproject/iris/tree/python
use rusqlite::{Connection, Result, named_params};
use std::{fs, path::Path, time::{SystemTime, UNIX_EPOCH}};
use crate::medications::Medication;
use crate::user::User;
use uuid::Uuid;

fn create_database(file_path: &str) {
    let connection = Connection::open(file_path).expect("Failed to open the database.");
    connection.execute_batch(fs::read_to_string("./src/schema.sql").expect("Reading the schema file failed.").as_str()).expect("Creating the file from SQL Schema failed.");
}

pub struct Database {
    connection: Connection,
}

impl Database {
    pub fn new() -> Database {
        let path = "./iris.db";
        if !Path::new(path).exists() {
            create_database(path);
        }

        Database {
            connection: Connection::open(path).expect("Opening the connection failed.")
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
        dose: f64,
        supply: f64,
        first_added: f64,
        last_taken: f64,
        frequency: Option<String>,
        measurement: &str
    ) -> Result<()> {
        // assuming connection is initialized properly

        // Change to using the actual connection, but for now, using a connection in memory
        // let conn = Connection::open_in_memory()?;

        self.connection.execute(
            "INSERT INTO medication (name, brand, dose, frequency, supply, first_added, last_taken, measurement)
        VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8)",
            (
                name,
                brand,
                dose,
                frequency,
                supply,
                first_added,
                last_taken,
                measurement
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

    pub fn set_medication_last_taken(&mut self, name: &str, timestamp: f64) {
        self.connection.execute("UPDATE medication SET last_taken = ?last_taken WHERE name = ?name", (timestamp, name)).expect("Updating the medication last_taken value did not work.");
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
                last_taken: row.get(6)?,
                measurement: row.get(7)?,
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
                last_taken: row.get(6)?,
                measurement: row.get(7)?,
            })
        }).expect("That did not work.");

        let mut vec_to_return: Vec<Medication> = vec![];

        for med in matched_medications {
            vec_to_return.push(med.expect("ok"));
        }

        return vec_to_return;
    }



    pub fn log_medication(&mut self, name: String, dosage: String, comments: Option<String>) -> f64 {
        // todo: testing required
        let timestamp = SystemTime::now().duration_since(UNIX_EPOCH).expect("Time went backwards").as_secs_f64();
        
        self.connection.execute(
            "INSERT INTO medication_log (name, dosage, comments) VALUES (:timestamp, :name, :dose, :comments)", 
            named_params! {":timestamp": timestamp, ":name": name, ":dose": dosage, ":comments": comments}
        ).expect("Inserting into log_medication failed.");
        return timestamp;
    }

    pub fn user_exists(&mut self, credential: String) -> Result<User, &'static str> {
        // todo: count the results, if result == 0, do Err(error message)
        // todo: if result == 1, return a User
        let mut statement = self.connection.prepare(
            "SELECT * FROM user WHERE credential = :credential"
        ).expect("This did not work");

        let mut matched_user = statement.query_map(&[(":credential", credential.to_string().as_str())], |row| {
            Ok(User {
                id: row.get(0)?,
                full_name: row.get(1)?,
                type_of: row.get(2)?,
                credential: row.get(3)?,
            })
        }).expect("This did not work");

        let result = matched_user.next();
        match result {
            Some(Ok(result)) => Ok(result),
            Some(Err(_)) => Err("No user found"),
            None => Err("No user found")
        }

    }

    pub fn create_user(&mut self, name: String, type_of: String, credential: String) -> User {
        let user_id = Uuid::new_v4().to_string();
        self.connection.execute("INSERT INTO user (id, name, type, credential) VALUES (?1, ?2, ?3, ?4)", (&user_id, &name, &type_of, &credential)).expect("Failed to create a new user in the database.");

        User::new(credential).expect("Newly created user was not found in the database.")
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
        let mut d = Database::new();
        assert_eq!(d.get_all_medications().len(), 0);
        fs::remove_file("./iris.db").expect("Deleting the file failed.");
    }

    #[test]
    fn medication_successfully_added() {
        let mut d = Database::new();
        d.add_medication("Zoloft", "Zoloft", 25.0, 20.0, 0.0, 0.0, Some("Once daily".to_string()), "mg").expect("Adding the medication failed.");

        assert_eq!(d.search_medications("Zoloft").len(), 1);
        fs::remove_file("./iris.db").expect("Deleting the file failed.");
    }

    #[test]
    fn user_successfully_retrieved() {
        let mut d = Database::new();
        let conn = Connection::open("./iris.db").expect("failed to open connection");

        conn.execute(
            "INSERT INTO user (id, name, type, credential)
            VALUES(?1, ?2, ?3, ?4)",
            ("1", "User", "Patient", "1234")
        ).expect("Failed");

        let test_user = d.user_exists("1234".to_string());

        match test_user {
            Ok(test_user) => {assert_eq!(test_user.id, "1");},
            Err(test_user) => panic!("Failed")
        }
        
        fs::remove_file("./iris.db").expect("Deleting the file failed.");
    }

    #[test]
    fn user_successfully_created() {
        let mut d = Database::new();
        let test_user = d.create_user("User".to_string(), "Patient".to_string(), "1234".to_string());

        assert_eq!(test_user.full_name, "User");
        fs::remove_file("./iris.db").expect("Deleting the file failed.");
    }
}
