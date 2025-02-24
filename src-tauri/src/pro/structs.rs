use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize)]
pub struct PatientReportedOutcome {
    pub id: String,
    pub recorded_date: i64,
    pub question: String,
    pub response: i32,
}
