CREATE TABLE IF NOT EXISTS medication_log (
    timestamp INTEGER NOT NULL PRIMARY KEY,
    name TEXT NOT NULL,
    dose TEXT NOT NULL,
    comments TEXT NOT NULL
) STRICT;

CREATE TABLE IF NOT EXISTS medication (
    name TEXT NOT NULL PRIMARY KEY,
    brand TEXT NOT NULL,
    dose INTEGER NOT NULL,
    supply INTEGER NOT NULL,
    first_added INTEGER NOT NULL,
    last_taken INTEGER NOT NULL
    --FOREIGN KEY (last_token) REFERENCES medication_log(timestamp)
) STRICT;


CREATE TABLE IF NOT EXISTS resource (
    label TEXT NOT NULL NOT NULL,
    resource_value TEXT NOT NULL PRIMARY KEY NOT NULL,
    added_by TEXT NOT NULL NOT NULL,
    resource_type TEXT NOT NULL NOT NULL
) STRICT;

CREATE TABLE IF NOT EXISTS contact_info (
    nurse_name TEXT NOT NULL PRIMARY KEY NOT NULL,
    label TEXT NOT NULL NOT NULL,
    info_value TEXT NOT NULL NOT NULL
) STRICT;

CREATE TABLE IF NOT EXISTS pro (
    pro_date TEXT NOT NULL,
    question TEXT NOT NULL,
    response TEXT NOT NULL,
    PRIMARY KEY (pro_date, question)
) STRICT;

CREATE TABLE IF NOT EXISTS care_instruction (
    ci_text TEXT NOT NULL PRIMARY KEY,
    frequency TEXT,
    added_by TEXT NOT NULL,
    first_added INTEGER NOT NULL
) STRICT;