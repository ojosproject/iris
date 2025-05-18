// File:     resources/schema.rs
// Purpose:  The SQL structure of the Resources tool.
// Authors:  Ojos Project & Iris contributors
// License:  GNU General Public License v3.0
pub static RESOURCES_SCHEMA: &str = r#"
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
    description TEXT NOT NULL,
    url TEXT NOT NULL PRIMARY KEY,
    organization TEXT NOT NULL,
    category TEXT NOT NULL,
    last_updated INTEGER NOT NULL
) STRICT;
"#;
