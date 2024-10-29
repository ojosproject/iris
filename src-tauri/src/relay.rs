// relay.rs

use crate::structs::{ErrorResponse, Status};
use dotenv::dotenv;
use reqwest::{blocking::Client, Error, StatusCode};
use serde::{Deserialize, Serialize};
use std::env;

// todo: create SMS structs... & properly import

pub fn send_SMS_message(message: String) -> (bool, Status) {
    dotenv().ok();

    let twilio_account_sid =
        env::var("TWILIO_ACCOUNT_SID").expect("Could not retrieve twilio account sid");
    let twilio_auth_token =
        env::var("TWILIO_AUTH_TOKEN").expect("Could not retrieve twilio auth token");
    let twilio_phone_number =
        env::var("TWILIO_PHONE_NUMBER").expect("Could not retrieve twilio PHone number");
    // recipient_phone_number will likely later be a vector of phone numbers &
    // this function will need to be modified to store an individual phone
    // number from a list of numbers here
    let recipient_phone_number =
        env::var("RECIPIENT_PHONE_NUMBER").expect("could not retrieve recipient phone number");

    let request_url =
        format!("https://api.twilio.com/2010-04-01/Accounts/{twilio_account_sid}/Messages.json");
    //todo: maybe don't hard code this url... maybe put it in .env

    let client = Client::new();
    let request_params = [
        ("To", &recipient_phone_number),
        ("From", &twilio_phone_number),
        ("Body", &message),
    ];

    let response = client
        .post(request_url)
        .basic_auth(twilio_account_sid, Some(twilio_auth_token))
        .form(&request_params)
        .send()
        .expect("FAILED TO SEND MESSAGE");

    let response_status = response.status();
    let response_body = response.text();

    match response_status {
        StatusCode::BAD_REQUEST => return (false, Status::ClientError(response_body.unwrap())),
        StatusCode::TOO_MANY_REQUESTS => {
            return (
                false,
                Status::TooManyRequests("you've been rate limited".to_string()),
            )
        }
        StatusCode::OK => return (true, Status::Ok),
        _ => return (false, Status::OtherError(response_body.unwrap())),
    }
}

fn handle_error(body: String) {
    let error_response: ErrorResponse =
        serde_json::from_str(&body).expect("Unable to deserialise JSON error response.");
    // handle error with error_response.message here
}
