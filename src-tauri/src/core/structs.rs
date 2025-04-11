use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize)]
pub struct DataPack {
    pub pro: Option<Vec<ProQuestionDataPack>>,
    pub resources: Option<Vec<ResourceDataPack>>,
}

#[derive(Serialize, Deserialize)]
pub struct ResourceDataPack {
    pub label: String,
    pub description: String,
    pub url: String,
    pub organization: String,
    pub category: String,
    pub last_updated: Option<f32>,
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
}

#[derive(Serialize, Deserialize)]
pub struct User {
    pub id: String,
    pub full_name: String,
    pub type_of: String,
    pub phone_number: Option<i64>,
    pub email: Option<String>,
}

#[derive(Serialize, Deserialize)]
pub struct ConfigContact {
    pub method: String,
    pub value: String,
}

#[derive(Serialize, Deserialize)]
pub struct Config {
    pub onboarding_completed: bool,
    pub contacts: Vec<ConfigContact>,
}
