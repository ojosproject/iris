// File:     main.rs
// Purpose:  Run Iris.
// Authors:  Ojos Project & Iris contributors
// License:  GNU General Public License v3.0
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

fn main() {
    iris_lib::run()
}
