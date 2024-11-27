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
