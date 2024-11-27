/*
patient_recorded_outcome
PROs to ensure the patient is getting proper care

Rows:
    * recorded_date - The date in YYYY-MM-DD format
    * question      - The PRO question asked
    response        - The PRO response given by the patient
*/
CREATE TABLE IF NOT EXISTS patient_recorded_outcome (
    id TEXT NOT NULL PRIMARY KEY,
    recorded_date INTEGER NOT NULL,
    question TEXT NOT NULL,
    response INTEGER NOT NULL
) STRICT;
