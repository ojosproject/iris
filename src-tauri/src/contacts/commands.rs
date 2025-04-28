use crate::contacts::helper;
use crate::contacts::structs::Contact;
use rusqlite::Connection;
use tauri::{AppHandle, Manager};

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
    helper::get_all_contacts(&app)
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
    let contacts = match helper::get_all_contacts(&app) {
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
    let app_data_dir = app.path().app_data_dir().unwrap();
    let conn = match Connection::open(app_data_dir.join("iris.db")) {
        Ok(c) => c,
        Err(e) => return Err(format!("SQLite error: `{:?}`", e)),
    };

    let result = conn.execute("UPDATE contacts SET enabled_relay=0", []);
    if result.is_err() {
        return Err(format!("SQLite error: `{:?}`", result.err().unwrap()));
    }

    Ok(())
}

#[tauri::command(rename_all = "snake_case")]
pub fn get_patient_contact(app: AppHandle) -> Result<Contact, String> {
    let app_data_dir = app.path().app_data_dir().unwrap();
    let conn = match Connection::open(app_data_dir.join("iris.db")) {
        Ok(c) => c,
        Err(e) => return Err(format!("SQLite error: `{:?}`", e)),
    };

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
    helper::add_contact(
        &app,
        name,
        phone_number,
        company,
        email,
        contact_type,
        enabled_relay,
    )
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
    helper::update_contacts(
        &app,
        id,
        name,
        phone_number,
        company,
        email,
        contact_type,
        enabled_relay,
    )
}

#[tauri::command(rename_all = "snake_case")]
pub fn delete_contact(app: AppHandle, id: String) -> Result<(), String> {
    helper::delete_contact(&app, id)
}
