// File:     contacts/commands.rs
// Purpose:  Commands for the Contacts tool.
// Authors:  Ojos Project & Iris contributors
// License:  GNU General Public License v3.0
use crate::contacts::structs::Contact;
use crate::helpers::stamp;
use crate::helpers::{db_connect, unix_timestamp};
use rusqlite::named_params;
use tauri::AppHandle;

/// # `get_all_contacts` Command
///
/// Returns a `Contact[]`.
///
/// ## TypeScript Usage
///
/// ```typescript
/// invoke<Contact[]>('get_all_contacts').then(c => {
///     setContact(c);
/// });
/// ```

#[tauri::command]
pub fn get_all_contacts(app: AppHandle) -> Result<Vec<Contact>, String> {
    let conn = db_connect(&app);

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

/// # `get_single_contact` command
///
/// Returns a single contact, with the provided `id`.
///
/// ## TypeScript
///
/// ```typescript
/// invoke<Contact>('get_single_contact', {id: ''}).then(c => {
///     if (c) { // this COULD return a null, check!
///         setContact(c);
///     }
///     
/// });
/// ```
#[tauri::command(rename_all = "snake_case")]
pub fn get_single_contact(app: AppHandle, id: String) -> Option<Contact> {
    let contacts = match get_all_contacts(app) {
        Ok(c) => c,
        Err(_) => return None,
    };

    for contact in contacts {
        if contact.id == id {
            return Some(contact);
        }
    }
    return None;
}

#[tauri::command]
pub fn disable_relay_for_contacts(app: AppHandle) -> Result<(), String> {
    let conn = db_connect(&app);

    let result = conn.execute("UPDATE contacts SET enabled_relay=0", []);
    if result.is_err() {
        return Err(format!("SQLite error: `{:?}`", result.err().unwrap()));
    }

    Ok(())
}

#[tauri::command(rename_all = "snake_case")]
pub fn get_patient_contact(app: AppHandle) -> Result<Contact, String> {
    let conn = db_connect(&app);

    let mut stmt = match conn.prepare("SELECT * FROM contacts WHERE contact_type = 'PATIENT'") {
        Ok(s) => s,
        Err(e) => return Err(format!("SQLite error: {:?}", e)),
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

    let mut contact_to_return: Option<Contact> = None;
    for c in matched_c {
        match c {
            Ok(contact) => {
                if contact_to_return.is_none() {
                    contact_to_return = Some(contact);
                } else {
                    return Err(
                        "More than one patient was found in the database. Something is wrong."
                            .to_string(),
                    );
                }
            }
            Err(_) => return Err("Failed to convert Result to Contact.".to_string()),
        }
    }

    if contact_to_return.is_some() {
        return Ok(contact_to_return.unwrap());
    } else {
        return Err("No patient contact was found.".to_string());
    }
}

/// # `create_contact` Command
///
/// Creates a new `Contact` and returns it
///
/// ## TypeScript Usage
///
/// ```typescript
/// invoke<Contact>('create_contact', {
///         name: 'Peter Anteater',
///         phone_number: '123-456-7890',
///         company: 'UC Irvine',
///         email: 'panteater@uci.edu'
///     }).then(c => {
///     setContact(c);
/// })
/// ```
#[tauri::command(rename_all = "snake_case")]
pub fn create_contact(
    app: AppHandle,
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

    let conn = db_connect(&app);
    let (timestamp, uuid) = stamp();

    let contact = Contact {
        id: uuid,
        name,
        phone_number,
        company,
        email,
        contact_type,
        enabled_relay,
        last_updated: timestamp,
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

/// # `update_contact` Command
///
/// Updates a single `Contact` and returns it.
///
/// ## TypeScript
///
/// ```typescript
/// invoke<Contact>('update_contact', {
///         id: 'uuid',
///         name: 'John Smith',
///         phone_number: '098-765-4321',
///         company: 'The Irvine Company',
///         email: 'john.smith@gmail.com'
///     }).then(c => {
///     setContact(c);
/// })
/// ```
#[tauri::command(rename_all = "snake_case")]
pub fn update_contact(
    app: AppHandle,
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

    let conn = db_connect(&app);
    let ts = unix_timestamp();

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

#[tauri::command(rename_all = "snake_case")]
pub fn delete_contact(app: AppHandle, id: String) -> Result<(), String> {
    let conn = db_connect(&app);

    match conn.execute(
        "DELETE FROM contacts WHERE id=:id AND contact_type != 'PATIENT'",
        named_params! {":id": id},
    ) {
        Ok(_) => return Ok(()),
        Err(e) => return Err(format!("SQLite error: {:?}", e)),
    };
}
