/*
medication_log
To log medications given to the patient.

Rows:
    * timestamp     - The Unix timestamp of when the medication was added
    medication_name - The name of the medication given
    given_dose      - The dosage given to the patient
    comment         - (Optional) Any comments that might be important to note
*/
CREATE TABLE IF NOT EXISTS medication_log (
    timestamp REAL NOT NULL PRIMARY KEY,
    medication_name TEXT NOT NULL,
    given_dose REAL NOT NULL,
    comment TEXT
) STRICT;

/*
medication
Medications a patient is actively taking

Rows:
    * name      - The name of the medication
    brand       - (Optional) The brand of the medication
    dose        - The dose the patient should be given
    frequency   - The frequency the patient should take this medication, defaults to "AS NEEDED"
    supply      - The amount they have left
    first_added - A Unix timestamp of when this was first added
    last_taken  - (Optional) Last time this medication was given to the patient
    measurement - Unit of measurement to use (e.g.: mg)
*/
CREATE TABLE IF NOT EXISTS medication (
    name TEXT NOT NULL PRIMARY KEY,
    brand TEXT,
    dose REAL NOT NULL,
    frequency REAL NOT NULL,
    supply REAL NOT NULL,
    first_added REAL NOT NULL,
    last_taken REAL,
    upcoming_dose REAL,
    schedule TEXT,
    measurement TEXT NOT NULL
) STRICT;

/*
resource
Resources available for the patient and their family

Rows:
    label    - The display name of the resource
    * value  - Usually a URL, given to make `label` a link
    added_by - Full name of the individual who added this resource
    type     - The type of the resource. `FINANCIAL`, `MENTAL HEALTH`, & more
*/
CREATE TABLE IF NOT EXISTS resource (
    label TEXT NOT NULL,
    value TEXT NOT NULL PRIMARY KEY,
    added_by TEXT NOT NULL,
    type TEXT NOT NULL
) STRICT;

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
care_instruction
Extra care instructions provided by the caregivers for the nurses

Rows:
    * text      - The instruction in plaintext
    frequency   - The frequency this should be done, defaults to `AS NEEDED`
    added_by    - The name of the individual that requested these instructions
    first_added - The Unix timestamp of when this was added
*/
CREATE TABLE IF NOT EXISTS care_instruction (
    text TEXT NOT NULL PRIMARY KEY,
    frequency TEXT,
    added_by TEXT NOT NULL,
    first_added INTEGER NOT NULL
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
    type TEXT NOT NULL
);
