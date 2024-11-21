use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize)]
pub struct User {
    pub id: String,
    pub full_name: String,
    pub type_of: String,
    pub phone_number: Option<i64>,
    pub email: Option<String>,
}

#[derive(Serialize, Deserialize)]
pub struct Config {
    pub resources_last_call: i64,
    pub onboarding_completed: bool,
    pub pro_questions: Vec<String>,
}
