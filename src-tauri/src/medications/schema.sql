/*
medication_log
To log medications given to the patient.

Rows:
    * timestamp     - The Unix timestamp of when the medication was added
    medication_name - The name of the medication given
    given_dose      - The dosage given to the patient
    measurement     - The measurement of the given dose
    comment         - (Optional) Any comments that might be important to note
*/
CREATE TABLE IF NOT EXISTS medication_log (
    timestamp REAL NOT NULL PRIMARY KEY,
    medication_name TEXT NOT NULL,
    given_dose REAL NOT NULL,
    measurement TEXT NOT NULL,
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
    total_prescribed REAL NOT NULL,
    first_added REAL NOT NULL,
    last_taken REAL,
    upcoming_dose REAL,
    schedule TEXT,
    measurement TEXT NOT NULL,
    nurse_id TEXT NOT NULL
) STRICT;
