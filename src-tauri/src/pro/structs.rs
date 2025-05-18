// File:     pro/structs.rs
// Purpose:  Structs for the Patient Reported Outcomes tool.
// Authors:  Ojos Project & Iris contributors
// License:  GNU General Public License v3.0
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize)]
pub struct PatientReportedOutcome {
    pub id: String,
    pub recorded_date: i64,
    pub question: String,
    pub response: i32,
}

#[derive(Serialize, Deserialize)]
pub struct ProQuestion {
    pub id: String,
    pub category: String,
    pub question: String,
    pub question_type: String,
    pub lowest_ranking: Option<i32>,
    pub highest_ranking: Option<i32>,
    pub lowest_label: Option<String>,
    pub highest_label: Option<String>,
}
