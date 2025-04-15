// contact.rs
// Ojos Project
//
// All contacts associated with the user.
use crate::contacts::structs::Contact;
use chrono::Local;
use rusqlite::{named_params, Connection};
use tauri::{AppHandle, Manager};
use uuid::Uuid;

pub fn add_contact(
    app: &AppHandle,
    name: String,
    phone_number: Option<String>,
    company: Option<String>,
    email: Option<String>,
    contact_type: String,
    enabled_relay: bool,
) -> Result<Contact, String> {
    if !["PATIENT", "CAREGIVER"].contains(&contact_type.as_str()) {
        return Err(format!(
            "`contact_type` value `{}` is not valid.",
            contact_type
        ));
    }

    let app_data_dir = app.path().app_data_dir().unwrap();
    let conn = match Connection::open(app_data_dir.join("iris.db")) {
        Ok(c) => c,
        Err(e) => return Err(format!("SQLite error: `{:?}`", e)),
    };
    let ts = Local::now().timestamp();
    let id = Uuid::new_v4().to_string();

    let contact = Contact {
        id,
        name,
        phone_number,
        company,
        email,
        contact_type,
        enabled_relay,
        last_updated: ts,
    };

    match conn.execute(
        "INSERT INTO contacts(
            id, 
            name, 
            phone_number, 
            company, 
            email, 
            contact_type,
            enabled_relay,
            last_updated
        ) VALUES ( ?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8)",
        (
            &contact.id,
            &contact.name,
            &contact.phone_number,
            &contact.company,
            &contact.email,
            &contact.contact_type,
            &contact.enabled_relay,
            &contact.last_updated,
        ),
    ) {
        Ok(_) => return Ok(contact),
        Err(e) => return Err(format!("SQLite error: `{:?}`", e)),
    };
}

pub fn update_contacts(
    app: &AppHandle,
    id: String,
    name: String,
    phone_number: Option<String>,
    company: Option<String>,
    email: Option<String>,
    contact_type: String,
    enabled_relay: bool,
) -> Result<Contact, String> {
    if !["PATIENT", "CAREGIVER"].contains(&contact_type.as_str()) {
        return Err(format!(
            "`contact_type` value `{}` is not valid.",
            contact_type
        ));
    }

    let app_data_dir = app.path().app_data_dir().unwrap();
    let conn = match Connection::open(app_data_dir.join("iris.db")) {
        Ok(c) => c,
        Err(e) => return Err(format!("SQLite error: `{:?}`", e)),
    };
    let ts = Local::now().timestamp();

    let contact = Contact {
        id,
        name,
        phone_number,
        company,
        email,
        contact_type,
        enabled_relay,
        last_updated: ts,
    };

    match conn.execute(
        "UPDATE contacts SET name=:name, phone_number=:phone_number, company=:company, email=:email, contact_type=:contact_type, enabled_relay=:enabled_relay, last_updated=:last_updated WHERE id=:id",
        named_params! {
            ":id": &contact.id,
            ":name": &contact.name,
            ":phone_number": &contact.phone_number,
            ":company": &contact.company,
            ":email": &contact.email,
            ":contact_type": &contact.contact_type,
            ":enabled_relay": &contact.enabled_relay,
            ":last_updated": &contact.last_updated
        },
    ) {
        Ok(_) => return Ok(contact),
        Err(e) => return Err(format!("Sqlite error: `{:?}`", e))
    }
}

pub fn get_all_contacts(app: &AppHandle) -> Result<Vec<Contact>, String> {
    let app_data_dir = app.path().app_data_dir().unwrap();
    let conn = match Connection::open(app_data_dir.join("iris.db")) {
        Ok(c) => c,
        Err(e) => return Err(format!("SQLite error: `{:?}`", e)),
    };

    let mut stmt = match conn.prepare("SELECT * FROM contacts ORDER BY name") {
        Ok(s) => s,
        Err(e) => return Err(format!("SQLite error: `{:?}`", e)),
    };
    let matched_c = match stmt.query_map([], |row| {
        Ok(Contact {
            id: row.get(0)?,
            name: row.get(1)?,
            phone_number: row.get(2)?,
            company: row.get(3)?,
            email: row.get(4)?,
            contact_type: row.get(5)?,
            enabled_relay: row.get(6)?,
            last_updated: row.get(7)?,
        })
    }) {
        Ok(m) => m,
        Err(e) => return Err(format!("SQLite error: `{:?}`", e)),
    };

    let mut vec_to_return: Vec<Contact> = vec![];
    for c in matched_c {
        vec_to_return.push(match c {
            Ok(mc) => mc,
            Err(e) => return Err(format!("Failed to convert Result to Contact: `{:?}`", e)),
        });
    }

    Ok(vec_to_return)
}

pub fn delete_contact(app: &AppHandle, id: String) -> Result<(), String> {
    let app_data_dir = app.path().app_data_dir().unwrap();
    let conn = match Connection::open(app_data_dir.join("iris.db")) {
        Ok(c) => c,
        Err(e) => return Err(format!("SQLite error: {:?}", e)),
    };

    match conn.execute(
        "DELETE FROM contacts WHERE id=:id AND contact_type != 'PATIENT'",
        named_params! {":id": id},
    ) {
        Ok(_) => return Ok(()),
        Err(e) => return Err(format!("SQLite error: {:?}", e)),
    };
}
