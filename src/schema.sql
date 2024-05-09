/*
schema.sql
Ojos Project

This schema shows the structure of our database and is often used in testing.
*/
CREATE TABLE IF NOT EXISTS medication_log (
    log_timestamp INTEGER NOT NULL PRIMARY KEY,
    medication_name TEXT NOT NULL,
    medication_dose TEXT NOT NULL,
    comments TEXT NOT NULL
) STRICT;

CREATE TABLE IF NOT EXISTS medication (
    name TEXT NOT NULL PRIMARY KEY,
    brand TEXT NOT NULL,
    dose INTEGER NOT NULL,
    supply INTEGER NOT NULL,
    first_added INTEGER NOT NULL,
    last_taken INTEGER NOT NULL
    -- FOREIGN KEY (last_taken) REFERENCES medication_log(log_timestamp)
) STRICT;


CREATE TABLE IF NOT EXISTS resource (
    resource_label TEXT NOT NULL NOT NULL,
    resource_value TEXT NOT NULL PRIMARY KEY NOT NULL,
    added_by TEXT NOT NULL NOT NULL,
    resource_type TEXT NOT NULL NOT NULL
) STRICT;

CREATE TABLE IF NOT EXISTS nurse_info (
    nurse_name TEXT NOT NULL PRIMARY KEY NOT NULL,
    nurse_label TEXT NOT NULL NOT NULL,
    info_value TEXT NOT NULL NOT NULL
) STRICT;

CREATE TABLE IF NOT EXISTS patient_recorded_outcome (
    recorded_date TEXT NOT NULL,
    question TEXT NOT NULL,
    response TEXT NOT NULL,
    PRIMARY KEY (recorded_date, question)
) STRICT;

CREATE TABLE IF NOT EXISTS care_instruction (
    ci_text TEXT NOT NULL PRIMARY KEY,
    frequency TEXT,
    added_by TEXT NOT NULL,
    first_added INTEGER NOT NULL
) STRICT;