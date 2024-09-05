use rusqlite::Connection;
use std::{fs, path::PathBuf};

pub fn create_database(file_path: PathBuf) {
    let connection = Connection::open(file_path).expect("Failed to open the database.");
    connection
        .execute_batch(
            fs::read_to_string("./src/schema.sql")
                .expect("Reading the schema file failed.")
                .as_str(),
        )
        .expect("Creating the file from SQL Schema failed.");

    connection
        .execute(
            "INSERT INTO user(id, full_name, type) VALUES ('0', 'patient', 'PATIENT')",
            [],
        )
        .unwrap();
}

pub fn import_dummy_data(file_path: PathBuf) {
    let conn = Connection::open(file_path).unwrap();
    conn.execute_batch(fs::read_to_string("./tests/testing.sql").unwrap().as_str())
        .unwrap();
}
