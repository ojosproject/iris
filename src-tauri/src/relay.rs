// relay.rs

use crate::config;
use crate::structs::ResponseStatus;
use dotenv::dotenv;
use reqwest::{blocking::Client, Error, StatusCode};
use serde::{Deserialize, Serialize};
use std::env;
use tauri::AppHandle;

pub fn send_SMS_message(message: &String, recipient: String) -> (bool, ResponseStatus) {
    dotenv().ok();

    let twilio_account_sid =
        env::var("TWILIO_ACCOUNT_SID").expect("Could not retrieve twilio account sid");
    let twilio_auth_token =
        env::var("TWILIO_AUTH_TOKEN").expect("Could not retrieve twilio auth token");
    let twilio_phone_number =
        env::var("TWILIO_PHONE_NUMBER").expect("Could not retrieve twilio PHone number");
    let recipient_phone_number =
        env::var("RECIPIENT_PHONE_NUMBER").expect("could not retrieve recipient phone number");
    // I am leaving this variable here for the sake of potential testing. It can just be my personal phone number if/when we test independently of calls to config.rs

    let request_url =
        format!("https://api.twilio.com/2010-04-01/Accounts/{twilio_account_sid}/Messages.json");
    //todo: maybe don't hard code this url... maybe put it in .env

    let client = Client::new();
    let request_params = [
        ("To", &recipient),
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
        StatusCode::BAD_REQUEST => return (false, ResponseStatus::ClientError(response_body.unwrap())),
        StatusCode::TOO_MANY_REQUESTS => {
            return (
                false,
                ResponseStatus::TooManyRequests("You've been rate limited - message failed to send".to_string()),
            )
        }
        StatusCode::OK => return (true, ResponseStatus::Ok("Message successfully sent".to_string())),
        _ => return (false, ResponseStatus::OtherError(response_body.unwrap())),
    }
}

pub fn read_response_status(response : ResponseStatus) -> String {
    match response {
        ResponseStatus::ClientError(s) => return s,
        ResponseStatus::TooManyRequests(s) => return s,
        ResponseStatus::Ok(s) => return s,
        ResponseStatus::OtherError(s) => return s,
    }
}

// fn handle_error(body: String) {
//     let error_response: ErrorResponse =
//         serde_json::from_str(&body).expect("Unable to deserialise JSON error response.");
//     // handle error with error_response.message here
// }

// I honestly don't see the need for separate functions to handle errors/successes
// but that's probably just because I'm a bad programmer
