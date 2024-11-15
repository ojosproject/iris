/*
contact_method
Contact information, typically nurses or caregivers

Rows:
    full_name   - Full name of the individual
    type        - `PHONE`, `EMAIL`, etc.
    label       - A custom label, ex.: "Nurse Jane's Phone"
    * value     - The actual phone number, email address, etc.
*/
CREATE TABLE IF NOT EXISTS contact_method (
    full_name TEXT NOT NULL,
    type TEXT NOT NULL,
    label TEXT NOT NULL,
    value TEXT NOT NULL PRIMARY KEY
) STRICT;


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

/*
    * id        - User ID
    name        - Name of the individual
    type        - "PATIENT", "CAREGIVER", or "NURSE"
    credential  - A pin. Temporarily removed for developmental purposes.
*/
CREATE TABLE IF NOT EXISTS user (
    id TEXT PRIMARY KEY NOT NULL,
    full_name TEXT NOT NULL,
    type TEXT NOT NULL,
    phone_number REAL,
    email TEXT
);
