// relay.rs

use crate::structs::ResponseStatus;
use crate::config::get_contacts;
use dotenv::dotenv;
use reqwest::{blocking::Client, Error, StatusCode};
use serde::{Deserialize, Serialize};
use std::env;
use tauri::AppHandle;

pub fn relay(body: &String, app: AppHandle) {
    let contacts = get_contacts(app);

    for contact in contacts {
        if contact.get("type").unwrap() == "sms" {
            send_sms_message(body, contact.get("value").unwrap());
        }
        else if contact.get("type").unwrap() == "email" {
            send_email(body, contact.get("value").unwrap());
        }
    }
}

pub fn send_sms(message: &String, recipient: &String){
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
    // change the above URL to the flask API created once that exists
    // also ensure that the naming conventions sent from here correspond to the
    // ones received there (if that's necessary I don't really know)

    let client = Client::new();
    let request_params = [
        ("To", &recipient),
        ("From", &&twilio_phone_number),
        ("Body", &message),
    ];

    let response = client
        .post(request_url)
        .basic_auth(twilio_account_sid, Some(twilio_auth_token))
        .form(&request_params)
        .send()
        .expect("FAILED TO SEND MESSAGE");
    
    // response & the below code is for dealing with the response from the POST 
    // request. Uncomment & modify when we do end up dealing with that

    let response_status = response.status();
    let response_body = response.text();
    //
    // match response_status {
    //     StatusCode::BAD_REQUEST => return (false, ResponseStatus::ClientError(response_body.unwrap())),
    //     StatusCode::TOO_MANY_REQUESTS => {
    //         return (
    //             false,
    //             ResponseStatus::TooManyRequests("You've been rate limited - message failed to send".to_string()),
    //         )
    //     }
    //     StatusCode::OK => return (true, ResponseStatus::Ok("Message successfully sent".to_string())),
    //     _ => return (false, ResponseStatus::OtherError(response_body.unwrap())),
    // }
}

pub fn send_email(message: &String, recipient: &String) {
    // todo: send emails. given an email address.
    ;
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
