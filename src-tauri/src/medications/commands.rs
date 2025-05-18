// File:     medications/commands.rs
// Purpose:  Commands for the Medications tool.
// Authors:  Ojos Project & Iris contributors
// License:  GNU General Public License v3.0
use crate::{
    helpers::{db_connect, stamp, unix_timestamp},
    medications::structs::{Medication, MedicationLog},
};
use rusqlite::named_params;
use tauri::AppHandle;

#[tauri::command(rename_all = "snake_case")]
pub fn create_medication(
    app: AppHandle,
    name: String,
    generic_name: Option<String>,
    dosage_type: String,
    strength: f64,
    units: String,
    quantity: f64,
    start_date: Option<i64>,
    end_date: Option<i64>,
    expiration_date: Option<i64>,
    frequency: Option<String>,
    notes: Option<String>,
    icon: String,
) -> Result<Medication, String> {
    let conn = db_connect(&app);
    let (timestamp, uuid) = stamp();

    match conn.execute("INSERT INTO medication (id, name, generic_name, dosage_type, strength, units, quantity, created_at, updated_at, start_date, end_date, expiration_date, frequency, notes, icon) VALUES (:id, :name, :generic_name, :dosage_type, :strength, :units, :quantity, :created_at, :updated_at, :start_date, :end_date, :expiration_date, :frequency, :notes, :icon)",
        named_params! {":id": uuid, ":name": name, ":generic_name": generic_name, ":dosage_type": dosage_type, ":strength": strength, ":units": units, ":quantity": quantity, ":created_at": timestamp, ":updated_at": timestamp, ":start_date": start_date, ":end_date": end_date, ":expiration_date": expiration_date, ":frequency": frequency, ":notes": notes, ":icon": icon}) {
            Ok(_) => {
                return Ok(Medication {
                    id: uuid,
                    name,
                    generic_name,
                    dosage_type,
                    strength,
                    units,
                    quantity,
                    created_at: timestamp,
                    updated_at: timestamp,
                    start_date,
                    end_date,
                    expiration_date,
                    frequency,
                    notes,
                    last_taken: None,
                    icon
                })
            },
            Err(e) => return Err(format!("SQLite error: {:?}", e)),
        }
}

/// Returns a vector of medications with matched `medication_name`. If the
/// vector is empty, no matches were found.
#[tauri::command(rename_all = "snake_case")]
pub fn search_medications(app: AppHandle, medication_name: String) -> Vec<Medication> {
    let conn = db_connect(&app);

    let mut stmt = conn
        .prepare(
            // https://github.com/rusqlite/rusqlite/issues/600#issuecomment-562258168
            "SELECT * FROM medication WHERE name LIKE '%' || ? || '%'",
        )
        .unwrap();
    let wrapped_medications = stmt
        .query_map([medication_name], |row| {
            Ok(Medication {
                id: row.get(0)?,
                name: row.get(1)?,
                generic_name: row.get(2)?,
                dosage_type: row.get(3)?,
                strength: row.get(4)?,
                units: row.get(5)?,
                quantity: row.get(6)?,
                created_at: row.get(7)?,
                updated_at: row.get(8)?,
                start_date: row.get(9)?,
                end_date: row.get(10)?,
                expiration_date: row.get(11)?,
                frequency: row.get(12)?,
                notes: row.get(13)?,
                last_taken: row.get(14)?,
                icon: row.get(15)?,
            })
        })
        .unwrap();

    let mut unwrapped_medications = vec![];
    for wrap in wrapped_medications {
        unwrapped_medications.push(wrap.unwrap());
    }
    unwrapped_medications
}

/// Returns a vector of medications with matched `id`. If the vector is empty,
/// no matches were found.
#[tauri::command(rename_all = "snake_case")]
pub fn get_medications(app: AppHandle, id: Option<String>) -> Vec<Medication> {
    let conn = db_connect(&app);

    if id.is_some() {
        let mut stmt = conn
            .prepare("SELECT * FROM medication WHERE id=:id")
            .unwrap();
        let wrapped_medications = stmt
            .query_map(named_params! {":id": id}, |row| {
                Ok(Medication {
                    id: row.get(0)?,
                    name: row.get(1)?,
                    generic_name: row.get(2)?,
                    dosage_type: row.get(3)?,
                    strength: row.get(4)?,
                    units: row.get(5)?,
                    quantity: row.get(6)?,
                    created_at: row.get(7)?,
                    updated_at: row.get(8)?,
                    start_date: row.get(9)?,
                    end_date: row.get(10)?,
                    expiration_date: row.get(11)?,
                    frequency: row.get(12)?,
                    notes: row.get(13)?,
                    last_taken: row.get(14)?,
                    icon: row.get(15)?,
                })
            })
            .unwrap();
        let mut unwrapped_medications = vec![];
        for wrap in wrapped_medications {
            unwrapped_medications.push(wrap.unwrap());
        }
        unwrapped_medications
    } else {
        let mut stmt = conn.prepare("SELECT * FROM medication").unwrap();
        let wrapped_medications = stmt
            .query_map([], |row| {
                Ok(Medication {
                    id: row.get(0)?,
                    name: row.get(1)?,
                    generic_name: row.get(2)?,
                    dosage_type: row.get(3)?,
                    strength: row.get(4)?,
                    units: row.get(5)?,
                    quantity: row.get(6)?,
                    created_at: row.get(7)?,
                    updated_at: row.get(8)?,
                    start_date: row.get(9)?,
                    end_date: row.get(10)?,
                    expiration_date: row.get(11)?,
                    frequency: row.get(12)?,
                    notes: row.get(13)?,
                    last_taken: row.get(14)?,
                    icon: row.get(15)?,
                })
            })
            .unwrap();
        let mut unwrapped_medications = vec![];
        for wrap in wrapped_medications {
            unwrapped_medications.push(wrap.unwrap());
        }
        unwrapped_medications
    }
}

#[tauri::command(rename_all = "snake_case")]
pub fn delete_medication(app: AppHandle, id: String) {
    let conn = db_connect(&app);
    conn.execute("DELETE medication WHERE id=:id", named_params! {":id": id})
        .unwrap();
}

#[tauri::command(rename_all = "snake_case")]
pub fn update_medication(
    app: AppHandle,
    id: String,
    name: Option<String>,
    generic_name: Option<String>,
    strength: Option<f64>,
    quantity: Option<i64>,
    end_date: Option<i64>,
    expiration_date: Option<i64>,
    frequency: Option<String>,
    notes: Option<String>,
    icon: Option<String>,
) {
    let conn = db_connect(&app);
    let timestamp = unix_timestamp();

    if name.is_some() {
        conn.execute(
            "UPDATE medication SET name=:name, updated_at=:updated_at WHERE id=:id",
            named_params! {":id": id, ":name": name, ":updated_at": timestamp},
        )
        .expect("Updating medication.name failed.");
    }

    if generic_name.is_some() {
        conn.execute(
            "UPDATE medication SET generic_name=:generic_name, updated_at=:updated_at WHERE id=:id",
            named_params! {":id": id, ":generic_name": generic_name, ":updated_at": timestamp},
        )
        .expect("Updating medication.generic_name failed.");
    }

    if strength.is_some() {
        conn.execute(
            "UPDATE medication SET strength=:strength, updated_at=:updated_at WHERE id=:id",
            named_params! {":id": id, ":strength": strength, ":updated_at": timestamp},
        )
        .expect("Updating medication.strength failed.");
    }

    if quantity.is_some() {
        conn.execute(
            "UPDATE medication SET quantity=:quantity, updated_at=:updated_at WHERE id=:id",
            named_params! {":id": id, ":quantity": quantity, ":updated_at": timestamp},
        )
        .expect("Updating medication.quantity failed.");
    }

    if end_date.is_some() {
        conn.execute(
            "UPDATE medication SET end_date=:end_date, updated_at=:updated_at WHERE id=:id",
            named_params! {":id": id, ":end_date": end_date, ":updated_at": timestamp},
        )
        .expect("Updating medication.end_date failed.");
    }

    if expiration_date.is_some() {
        conn.execute(
            "UPDATE medication SET expiration_date=:expiration_date, updated_at=:updated_at WHERE id=:id",
            named_params! {":id": id, ":expiration_date": expiration_date, ":updated_at": timestamp},
        )
        .expect("Updating medication.expiration_date failed.");
    }

    if frequency.is_some() {
        conn.execute(
            "UPDATE medication SET frequency=:frequency, updated_at=:updated_at WHERE id=:id",
            named_params! {":id": id, ":frequency": frequency, ":updated_at": timestamp},
        )
        .expect("Updating medication.frequency failed.");
    }

    if notes.is_some() {
        conn.execute(
            "UPDATE medication SET notes=:notes, updated_at=:updated_at WHERE id=:id",
            named_params! {":id": id, ":notes": notes, ":updated_at": timestamp},
        )
        .expect("Updating medication.notes failed.");
    }

    if icon.is_some() {
        conn.execute(
            "UPDATE medication SET icon=:icon, updated_at=:updated_at WHERE id=:id",
            named_params! {":icon": icon, ":updated_at": timestamp, ":id": id},
        )
        .expect("Updating medication.icon failed.");
    }
}

#[tauri::command(rename_all = "snake_case")]
pub fn log_medication(
    app: AppHandle,
    id: String,
    strength: f64,
    units: String,
    comments: Option<String>,
) -> MedicationLog {
    let conn = db_connect(&app);
    let (timestamp, uuid) = stamp();

    conn.execute("INSERT INTO medication_log(id, timestamp, medication_id, strength, units, comments) VALUES (:id, :timestamp, :medication_id, :strength, :units, :comments)", named_params! {":id": uuid, ":timestamp": timestamp, ":medication_id": id, ":strength": strength, ":units": units, ":comments": comments}).expect("Inserting into medication_log failed.");
    conn.execute(
        "UPDATE medication SET last_taken=:last_taken, updated_at=:updated_at WHERE id=:id",
        named_params! {":id": id, ":last_taken": timestamp, ":updated_at": timestamp},
    )
    .expect("Updating medication.last_taken failed.");

    MedicationLog {
        id: uuid,
        timestamp,
        medication_id: id,
        strength,
        units,
        comments,
    }
}

#[tauri::command(rename_all = "snake_case")]
pub fn get_medication_logs(app: AppHandle, medication_id: Option<String>) -> Vec<MedicationLog> {
    let conn = db_connect(&app);
    if medication_id.is_some() {
        let mut stmt = conn
            .prepare("SELECT * FROM medication_log WHERE medication_id=:medication_id ORDER BY timestamp DESC")
            .unwrap();
        let wrapped_logs = stmt
            .query_map(
                named_params! {":medication_id": medication_id.unwrap()},
                |row| {
                    Ok(MedicationLog {
                        id: row.get(0)?,
                        timestamp: row.get(1)?,
                        medication_id: row.get(2)?,
                        strength: row.get(3)?,
                        units: row.get(4)?,
                        comments: row.get(5)?,
                    })
                },
            )
            .unwrap();

        let mut unwrapped_logs: Vec<MedicationLog> = vec![];
        for wrapped_log in wrapped_logs {
            unwrapped_logs.push(wrapped_log.unwrap());
        }
        //println!("{:?}", &unwrapped_logs[0].id);
        unwrapped_logs
    } else {
        let mut stmt = conn
            .prepare("SELECT * FROM medication_log ORDER BY timestamp DESC")
            .unwrap();
        let wrapped_logs = stmt
            .query_map([], |row| {
                Ok(MedicationLog {
                    id: row.get(0)?,
                    timestamp: row.get(1)?,
                    medication_id: row.get(2)?,
                    strength: row.get(3)?,
                    units: row.get(4)?,
                    comments: row.get(5)?,
                })
            })
            .unwrap();

        let mut unwrapped_logs: Vec<MedicationLog> = vec![];
        for wrapped_log in wrapped_logs {
            unwrapped_logs.push(wrapped_log.unwrap());
        }
        unwrapped_logs
    }
}
