/*
patient_recorded_outcome
PROs to ensure the patient is getting proper care

Rows:
    * recorded_date - The date in YYYY-MM-DD format
    * question      - The PRO question asked
    response        - The PRO response given by the patient
*/
CREATE TABLE IF NOT EXISTS patient_recorded_outcome (
    recorded_date TEXT NOT NULL,
    question TEXT NOT NULL,
    response TEXT NOT NULL,
    PRIMARY KEY (recorded_date, question)
) STRICT;
