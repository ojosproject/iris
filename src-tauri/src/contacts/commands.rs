use crate::contacts::helper;
use crate::contacts::structs::Contact;
use tauri::AppHandle;

/// # `get_all_contacts` Command
///
/// Returns a `Contact[]`.
///
/// ## TypeScript Usage
///
/// ```typescript
/// invoke('get_all_contacts').then(c => {
///     setContact(c as Contact[]);
/// });
/// ```

#[tauri::command]
pub fn get_all_contacts(app: AppHandle) -> Vec<Contact> {
    helper::get_all_contacts(&app)
}

/// # `get_single_contact` command
///
/// Returns a single contact, with the provided `id`.
///
/// ## TypeScript
///
/// ```typescript
/// invoke('get_single_contact', {id: ''}).then(c => {
///     if (c) { // this COULD return a null, check!
///         setContact(c as Contact);
///     }
///     
/// });
/// ```
#[tauri::command(rename_all = "snake_case")]
pub fn get_single_contact(app: AppHandle, id: String) -> Option<Contact> {
    for contact in helper::get_all_contacts(&app) {
        if contact.id == id {
            return Some(contact);
        }
    }
    return None;
}

/// # `create_contact` Command
///
/// Creates a new `Contact` and returns it
///
/// ## TypeScript Usage
///
/// ```typescript
/// invoke('create_contact', {
///         name: 'Peter Anteater',
///         phone_number: '123-456-7890',
///         company: 'UC Irvine',
///         email: 'panteater@uci.edu'
///     }).then(c => {
///     setContact(c as Contact);
/// })
/// ```
#[tauri::command(rename_all = "snake_case")]
pub fn create_contact(
    app: AppHandle,
    name: String,
    phone_number: Option<String>,
    company: Option<String>,
    email: Option<String>,
) -> Contact {
    helper::add_contact(&app, name, phone_number, company, email)
}

/// # `update_contact` Command
///
/// Updates a single `Contact` and returns it.
///
/// ## TypeScript
///
/// ```typescript
/// invoke('update_contact', {
///         id: 'uuid',
///         name: 'John Smith',
///         phone_number: '098-765-4321',
///         company: 'The Irvine Company',
///         email: 'john.smith@gmail.com'
///     }).then(c => {
///     setContact(c as Contact);
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
) -> Contact {
    helper::update_contacts(&app, id, name, phone_number, company, email)
}

#[tauri::command(rename_all = "snake_case")]
pub fn delete_contact(app: AppHandle, id: String) {
    helper::delete_contact(&app, id);
}
