use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize)]
pub struct Resource {
    pub label: String,
    pub description: String,
    pub url: String,
    pub organization: String,
    pub category: String,
    pub last_updated: f32,
}
