// schema.rs
// represents schema.sql as a rust string to be usable in executables

pub static MEDICATIONS_SCHEMA: &str = r#"
CREATE TABLE IF NOT EXISTS medication_log (
    id TEXT NOT NULL PRIMARY KEY,
    timestamp REAL NOT NULL,
    medication_id TEXT NOT NULL,
    strength REAL NOT NULL,
    units TEXT NOT NULL,
    comments TEXT
) STRICT;

CREATE TABLE IF NOT EXISTS medication (
    id TEXT NOT NULL PRIMARY KEY,
    name TEXT NOT NULL,
    generic_name TEXT,
    dosage_type TEXT NOT NULL,
    strength REAL NOT NULL,
    units TEXT NOT NULL,
    quantity REAL NOT NULL,
    created_at REAL NOT NULL,
    updated_at REAL NOT NULL,
    start_date REAL,
    end_date REAL,
    expiration_date REAL,
    frequency TEXT,
    notes TEXT
) STRICT;
"#;
