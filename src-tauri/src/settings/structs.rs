// File:     settings/structs.rs
// Purpose:  Provides structs for the Settings tool.
// Authors:  Ojos Project & Iris contributors
// License:  GNU General Public License v3.0
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize)]
pub struct DataPack {
    pub pro: Option<Vec<ProQuestionDataPack>>,
    pub resources: Option<Vec<ResourceDataPack>>,
    pub contacts: Option<Vec<ContactDataPack>>,
}

#[derive(Serialize, Deserialize)]
pub struct ContactDataPack {
    pub id: Option<String>,
    pub name: String,
    pub phone_number: Option<String>,
    pub company: Option<String>,
    pub email: Option<String>,
    pub contact_type: Option<String>,
    pub enabled_relay: Option<bool>,
    pub last_updated: Option<i64>,
}

#[derive(Serialize, Deserialize)]
pub struct ResourceDataPack {
    pub label: String,
    pub description: String,
    pub url: String,
    pub organization: String,
    pub category: String,
    pub last_updated: Option<i64>,
}

#[derive(Serialize, Deserialize)]
pub struct ProQuestionDataPack {
    pub id: Option<String>,
    pub category: String,
    pub question: String,
    pub question_type: String,
    pub lowest_ranking: Option<i32>,
    pub highest_ranking: Option<i32>,
    pub lowest_label: Option<String>,
    pub highest_label: Option<String>,
}

#[derive(Serialize, Deserialize)]
pub struct DataPackReceipt {
    pub resources_count: Option<usize>,
    pub pro_count: Option<usize>,
    pub contacts_count: Option<usize>,
}

#[derive(Serialize, Deserialize)]
pub struct Config {
    pub onboarding_completed: bool,
    pub appearance: Option<String>,
}
