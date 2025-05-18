// File:     resources/structs.rs
// Purpose:  Structs for the Resources tool.
// Authors:  Ojos Project & Iris contributors
// License:  GNU General Public License v3.0
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize)]
pub struct Resource {
    pub label: String,
    pub description: String,
    pub url: String,
    pub organization: String,
    pub category: String,
    pub last_updated: i64,
}
