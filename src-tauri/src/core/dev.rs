use rusqlite::Connection;
use std::{fs, path::PathBuf};

pub fn import_dummy_data(file_path: PathBuf) {
    let conn = Connection::open(file_path).unwrap();
    conn.execute_batch(fs::read_to_string("./tests/testing.sql").unwrap().as_str())
        .unwrap();
}

pub fn delete_database(file_path: PathBuf) {
    fs::remove_file(file_path).unwrap();
}
