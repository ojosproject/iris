// relay.rs

use crate::structs;
use dotenv::dotenv;
use reqwest::{blocking::Client, Error, StatusCode};
use std::env;
// use serde{Deserialize, Serialize};
// todo: create SMS structs... & properly import 