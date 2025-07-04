// File:     contacts/structs.rs
// Purpose:  Structs for the Contacts tool.
// Authors:  Ojos Project & Iris contributors
// License:  GNU General Public License v3.0
use serde::{Deserialize, Serialize};

/// # `Contact` struct
///
///  Contacts associated with the user.
#[derive(Serialize, Deserialize)]
pub struct Contact {
    pub id: String,
    pub name: String,
    pub phone_number: Option<String>,
    pub company: Option<String>,
    pub email: Option<String>,
    pub contact_type: String,
    pub enabled_relay: bool,
    pub last_updated: i64,
}
