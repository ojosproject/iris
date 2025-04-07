// relay.rs

use crate::config;
use reqwest::blocking::Client;
use serde::Deserialize;
use std::collections::HashMap;
use tauri::AppHandle;

pub fn relay(body: &String, app: &AppHandle) {
    let contacts = config::get_config(&app).contacts;
    let token = _verify_device_token(&app);

    if !token.is_empty() {
        for contact in contacts {
            if contact.method == "SMS" {
                send_sms(body, &contact.value, &token);
            } else if contact.method == "email" {
                send_email(body, &contact.value);
            }
        }
    } else {
        // As of now, the logic I have written sets token = the empty string if
        // the api fails to generate a token. If we don't have a token, we
        // can't send messages. What should this function do in this case?
    }
}

pub fn send_sms(message: &String, recipient: &String, token: &String) {
    let url = format!("http://127.0.0.1:5000/iris/relay/send-sms/");
    // the actual url will look like "https://api.ojosproject.org/iris/send-sms/"

    let client = Client::new();
    let mut request_map: HashMap<&str, &String> = HashMap::new();
    request_map.insert("to", recipient);
    request_map.insert("message", message);
    request_map.insert("token", token);

    let response = client.post(url).json(&request_map).send();

    match response {
        Ok(r) if r.status().is_success() => {
            println!("{}", r.text().expect("could not read success response"));
        }
        Ok(r) => {
            println!("SMS FAILURE STATUS: {}", r.status());
            println!("SMS FAILED BECAUSE: {:?}", r.text());
        }
        Err(err) => {
            println!("SMS FAILED WITH ERROR: {:?}", err);
        }
    }
    // probably return something simple (true or false?) to propagate to
    // relay & beyond whether messages were sent successfully or not.
    // Don't crash
}

pub fn send_email(message: &String, recipient: &String) {
    // todo: send emails. given an email address.
}

#[derive(Deserialize)]
struct TokenResponse {
    token: String,
}

/// Calls the server to check if the token stored on the device is expired. If
/// there is no token on the device (if the device has never called the server),
/// it calls the server and generates and returns the new token
fn _verify_device_token(app: &AppHandle) -> String {
    let mut token = config::get_api_token(&app);
    if token.is_empty() {
        let url = format!("http://127.0.0.1:5000/iris/auth/register/");
        let client = Client::new();
        let mut request_map: HashMap<&str, &str> = HashMap::new();
        request_map.insert("id", "device ");
        // TODO: figure out where to generate a unique device id. the device id must be unique as it will be stored in a database
        // ignore request_map for now.

        let response = client
            .post(url)
            .json(&request_map)
            .send()
            .expect("FAILED TO GENERATE TOKEN");

        if response.status().is_success() {
            let response_json: TokenResponse = response.json().expect("FAILED TO PARSE JSON");
            token = response_json.token;
            config::set_api_token(app.clone(), token.clone());
            return token;
        } else {
            return "".to_string();
        }
    } else {
        let url = format!("http://127.0.0.1:5000/iris/auth/update-token/");
        let client = Client::new();
        let mut request_map: HashMap<&str, &str> = HashMap::new();
        request_map.insert("token", &token);

        let response = client.post(url).json(&request_map).send();

        match response {
            Ok(r) if r.status().is_success() => {
                let response_json: TokenResponse = r.json().expect("FAILED TO PARSE JSON");
                token = response_json.token;
                config::set_api_token(app.clone(), token.clone());
                return token;
            }
            Ok(r) => {
                println!("UPDATING FAILURE STATUS: {}", r.status());
                println!("UPDATING FAILED BECAUSE: {:?}", r.text());
                return "".to_string();
            }
            Err(err) => {
                println!("SMS FAILED WITH ERROR: {:?}", err);
                return "".to_string();
            }
        }
    }
}
