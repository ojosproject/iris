// File:     contacts/schema.rs
// Purpose:  SQL schema for the Contacts tool.
// Authors:  Ojos Project & Iris contributors
// License:  GNU General Public License v3.0
pub static CONTACTS_SCHEMA: &str = r#"
/*
contact
All contacts associated with the user.

Rows:
    * id            - A UUID
    name            - The contact's name
    phone_number    - (Optional) The contact's phone number
    company         - (Optional) The contact's company
    email           - (Optional) The contact's email
    last_updated    - A Unix timestamp indicating the last edit
*/
CREATE TABLE IF NOT EXISTS contacts (
    id TEXT NOT NULL PRIMARY KEY,
    name TEXT NOT NULL,
    phone_number TEXT,
    company TEXT,
    email TEXT,
    contact_type TEXT NOT NULL,
    enabled_relay INTEGER NOT NULL,
    last_updated INTEGER NOT NULL
) STRICT;
"#;
