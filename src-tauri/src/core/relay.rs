// relay.rs

use crate::config;
use reqwest::{blocking::Client, Error, StatusCode};
use serde::{Deserialize, Serialize};
use serde_json::Value;
use std::{collections::HashMap, env};
use tauri::AppHandle;

pub fn relay(body: &String, app: AppHandle) {
    let contacts = config::get_config(&app).contacts;
    let token = _verify_device_token(app.clone());

    if !token.is_empty() {
        for contact in contacts {
            if contact.method == "sms" {
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
    let flask_url = format!("https://api.ojosproject.org/iris/send-sms/");

    let client = Client::new();
    let mut request_map: HashMap<&str, &String> = HashMap::new();
    request_map.insert("to", recipient);
    request_map.insert("message", message);

    let response = client
        .post(flask_url)
        .json(&request_map)
        .header("X-API-Key", token)
        .send();

    match response {
        Ok(r) if r.status().is_success() => (), // handle success here
        Ok(r) => (),                            // handle error here
        Err(err) => (),                         // handle error here
    }
}

pub fn send_email(message: &String, recipient: &String) {
    // todo: send emails. given an email address.
}

fn _verify_device_token(app: AppHandle) -> String {
    let token = config::get_api_token(app.clone());
    if token.is_empty() {
        let flask_url = format!("https://api.ojosproject.org/iris/register/");
        let client = Client::new();
        let mut request_map: HashMap<&str, &str> = HashMap::new();
        request_map.insert("id", "device id");
        // TODO: figure out where to generate a unique device id. the device id must be unique as it will be stored in a database
        // ignore request_map for now.

        let response = client
            .post(flask_url)
            .json(&request_map)
            .send()
            .expect("FAILED TO SEND MESSAGE");

        if response.status().is_success() {
            config::set_api_token(app.clone(), token.clone());
            return token;
        } else {
            return "".to_string();
        }
    } else {
        return token;
    }
}
