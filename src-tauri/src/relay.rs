// relay.rs

use crate::structs::ResponseStatus;
use crate::config::get_contacts;
use dotenv::dotenv;
use reqwest::{blocking::Client, Error, StatusCode};
use serde::{Deserialize, Serialize};
use std::{env, collections::HashMap};
use tauri::AppHandle;

pub fn relay(body: &String, app: AppHandle) {
    let contacts = get_contacts(app);

    for contact in contacts {
        if contact.get("type").unwrap() == "sms" {
            send_sms(body, contact.get("value").unwrap());
        }
        else if contact.get("type").unwrap() == "email" {
            send_email(body, contact.get("value").unwrap());
        }
    }
}

pub fn send_sms(message: &String, recipient: &String){
    dotenv().ok();

    let api_key = 12345;
    // GENERATE THIS TOKEN SOMEHOW SOMEWHERE ELSE

    let flask_url =
        format!("https://api.ojosproject.org/iris/send-sms/");

    let client = Client::new();
    let mut map: HashMap<&str, &String> = HashMap::new();
    map.insert("to", recipient);
    map.insert("message", message);


    let response = client
        .post(flask_url)
        .json(&map)
        .header("X-API-Key", api_key)
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
