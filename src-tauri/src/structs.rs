#![allow(dead_code)]
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize)]
pub struct Medication {
    pub name: String,
    pub brand: String,
    pub dosage: f64,
    pub frequency: f64,
    pub supply: Option<f64>,
    pub first_added: Option<f64>,
    pub last_taken: Option<f64>,
    pub upcoming_dose: Option<f64>,
    pub schedule: Option<String>,
    pub measurement: String,
}

#[derive(Serialize, Deserialize)]
pub struct User {
    pub id: String,
    pub full_name: String,
    pub type_of: String,
}

pub struct MedicationLog {
    pub timestamp: f64,
    pub medication_name: String,
    pub given_dose: f64,
    pub comment: Option<String>,
}

#[derive(Serialize, Deserialize)]
pub struct Config {
    pub resources_last_call: i64,
}

#[derive(Serialize, Deserialize)]
pub struct Resource {
    pub label: String,
    pub description: String,
    pub url: String,
    pub organization: String,
    pub category: String,
    pub last_updated: f32,
}


// may not end up using these structs
#[derive(Serialize, Deserialize)]
pub struct SMSResponse {
    account_sid: Option<String>,
    api_version: String,
    body: String,
    date_created: String,
    date_sent: String,
    date_updated: String,
    direction: String,
    error_code: String,
    error_message: String,
    from: String,
    messaging_service_sid: String,
    num_media: String,
    num_segments: String,
    price: String,
    price_unit: String,
    sid: String,
    status: String,
    subresource_uris: SubresourceUris,
    to: String,
    uri: String,
}

#[derive(Serialize, Deserialize)]
pub struct SubresourceUris {
    all_time: String,
    today: String,
    yesterday: String,
    this_month: String,
    last_month: String,
    daily: String,
    monthly: String,
    yearly: String,
}

#[derive(Serialize, Deserialize)]
pub struct ErrorResponse {
    code: u16,
    message: String,
    more_info: String,
    status: u16
}

pub enum Status {
    ClientError(String),
    TooManyRequests(String),
    Ok,
    OtherError(String)
}