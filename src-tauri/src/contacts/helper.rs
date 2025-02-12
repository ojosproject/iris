// contact.rs
// Ojos Project
//
// All contacts associated with the user.
use crate::contacts::structs::Contact;
use rusqlite::{named_params, Connection};
use tauri::{AppHandle, Manager};
use uuid::Uuid;

pub fn add_contact(
    app: &AppHandle,
    name: String,
    phone_number: Option<String>,
    company: Option<String>,
    email: Option<String>,
) -> Contact {
    let app_data_dir = app.path().app_data_dir().unwrap();
    let conn = Connection::open(app_data_dir.join("iris.db")).unwrap();
    let id = Uuid::new_v4().to_string();

    let c = Contact {
        id,
        name,
        phone_number,
        company,
        email,
    };

    conn.execute(
        "INSERT INTO contacts(
            id, 
            title, 
            content, 
            frequency, 
            added_by, 
            last_updated
        ) VALUES ( ?1, ?2, ?3, ?4, ?5, ?6)",
        (&c.id, &c.name, &c.phone_number, &c.company, &c.email),
    )
    .unwrap();

    c
}

pub fn update_contacts(
    app: &AppHandle,
    id: String,
    name: String,
    phone_number: Option<String>,
    company: Option<String>,
    email: Option<String>,
) -> Contact {
    let app_data_dir = app.path().app_data_dir().unwrap();
    let conn = Connection::open(app_data_dir.join("iris.db")).unwrap();

    let c = Contact {
        id,
        name,
        phone_number,
        company,
        email,
    };

    conn.execute(
        "UPDATE contacts SET name=:name, phone_number=:phone_number, company=:company, email=:email, WHERE id=:id",
        named_params! {
            ":id": &c.id,
            ":name": &c.name,
            ":phone_number": &c.phone_number,
            ":company": &c.company,
            ":email": &c.email,
        },
    )
    .unwrap();

    c
}

pub fn get_all_contacts(app: &AppHandle) -> Vec<Contact> {
    let app_data_dir = app.path().app_data_dir().unwrap();
    let conn = Connection::open(app_data_dir.join("iris.db")).unwrap();

    let mut stmt = conn
        .prepare("SELECT * FROM contacts ORDER BY name")
        .unwrap();
    let matched_c = stmt
        .query_map([], |row| {
            Ok(Contact {
                id: row.get(0)?,
                name: row.get(1)?,
                phone_number: row.get(2)?,
                company: row.get(3)?,
                email: row.get(4)?,
            })
        })
        .unwrap();

    let mut vec_to_return: Vec<Contact> = vec![];
    for c in matched_c {
        vec_to_return.push(c.unwrap());
    }

    vec_to_return
}

pub fn delete_contact(app: &AppHandle, id: String) {
    let app_data_dir = app.path().app_data_dir().unwrap();
    let conn = Connection::open(app_data_dir.join("iris.db")).unwrap();

    conn.execute(
        "DELETE FROM contacts WHERE id=:id",
        named_params! {":id": id},
    )
    .unwrap();
}
