// medications.rs
// Ojos Project
//
// This handles a lot of medication-related functions.
#![allow(dead_code)]
use std::time::{SystemTime, UNIX_EPOCH};

use crate::structs::Medication;
use chrono::{Local, NaiveTime};
use itertools::Itertools;
use rusqlite::{named_params, Connection};
use tauri::{AppHandle, Manager};

impl Medication {
    /// Creates a new medication in the database.
    pub fn create(
        app: AppHandle,
        name: &str,
        brand: &str,
        dosage: f64,
        frequency: f64,
        supply: f64,
        measurement: &str,
    ) -> Self {
        let app_data_dir = app.path().app_data_dir().unwrap().join("iris.db");
        let conn = Connection::open(app_data_dir).unwrap();

        let first_added = SystemTime::now()
            .duration_since(UNIX_EPOCH)
            .expect("Time went backwards")
            .as_secs_f64();

        let m = Medication {
            name: name.to_string(),
            brand: brand.to_string(),
            dosage,
            frequency,
            supply: Some(supply),
            first_added: Some(first_added),
            last_taken: None,
            upcoming_dose: None,
            schedule: None,
            measurement: measurement.to_string(),
        };

        conn.execute(
            "INSERT INTO medication (name, brand, dose, frequency, supply, first_added, last_taken, upcoming_dose, schedule, measurement)
        VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10)",
            (
                &m.name,
                &m.brand,
                &m.dosage,
                &m.frequency,
                &m.supply,
                &m.first_added,
                &m.last_taken,
                &m.upcoming_dose,
                &m.schedule,
                &m.measurement,
            ),
        ).unwrap();

        m
    }

    pub fn delete(&mut self, app: AppHandle) {
        let app_data_dir = app.path().app_data_dir().unwrap();
        let conn = Connection::open(app_data_dir.join("iris.db")).unwrap();

        conn.execute("DELETE FROM medication WHERE name = ?1", [&self.name])
            .unwrap();
    }

    pub fn set_dose(&mut self, app: AppHandle, dose: f64) {
        let app_data_dir = app.path().app_data_dir().unwrap();
        let conn = Connection::open(app_data_dir.join("iris.db")).unwrap();
        self.dosage = dose;

        conn.execute(
            "UPDATE medication SET dose = ?1 WHERE name = ?2",
            (&self.dosage, &self.name),
        )
        .unwrap();
    }

    pub fn set_supply(&mut self, app: AppHandle, supply: f64) {
        let app_data_dir = app.path().app_data_dir().unwrap();
        let conn = Connection::open(app_data_dir.join("iris.db")).unwrap();
        self.supply = Some(supply);

        conn.execute(
            "UPDATE medication SET supply = ?1 WHERE name = ?2",
            (&self.supply.unwrap(), &self.name),
        )
        .unwrap();
    }

    pub fn log(&mut self, app: AppHandle, comments: Option<String>) -> f64 {
        let app_data_dir = app.path().app_data_dir().unwrap();
        let conn = Connection::open(app_data_dir.join("iris.db")).unwrap();
        let current_timestamp = SystemTime::now()
            .duration_since(UNIX_EPOCH)
            .expect("Time went backwards")
            .as_secs_f64();
        self.last_taken = Some(current_timestamp);

        conn.execute(
            "INSERT INTO medication_log (timestamp, medication_name, given_dose, measurement, comment) VALUES (:timestamp, :medication_name, :given_dose, :measurement, :comment)", 
            named_params! {":timestamp": current_timestamp, ":medication_name": &self.name, ":given_dose": &self.dosage, ":measurement": &self.measurement, ":comment": comments}
        ).expect("Inserting into log_medication failed.");

        conn.execute(
            "UPDATE medication SET last_taken = ?1 WHERE name = ?2",
            (current_timestamp, &self.name),
        )
        .unwrap();

        self.set_upcoming_dose(app);
        //updates the medication's upcoming_dose such that every time a patient logs that they've taken a medication,
        //the next time they need to take that medication will be calculated and stored in the database

        self.last_taken
            .expect("Last taken was not found even though it was set...")
    }

    fn set_upcoming_dose(&mut self, app: AppHandle) {
        let now = Local::now();
        let midnight = now
            .with_time(NaiveTime::parse_from_str(format!("0:00").as_str(), "%-H:%M").unwrap())
            .unwrap()
            .timestamp();

        if self.schedule.is_none() {
            // ? If Medication.schedule is not set, it cannot set an upcoming medication. It can only log it.
            println!("medications::50 self.schedule not found, ignoring request...");
            return;
        }

        // ? Assumes self.schedule is already set.
        let split_schedule = self.schedule.as_ref().unwrap().split(',').sorted();
        // find unix timestamp of today with that time
        for scheduled_time in split_schedule {
            let next_dose_in_seconds = scheduled_time.parse::<f64>().unwrap() * 60.0 * 60.0;
            let next_dose = (midnight as f64) + next_dose_in_seconds;

            if now.timestamp() < next_dose as i64 {
                let app_data_dir = app.path().app_data_dir().unwrap();
                let conn = Connection::open(app_data_dir.join("iris.db")).unwrap();
                self.upcoming_dose = Some(next_dose);

                conn.execute(
                    "UPDATE medication SET upcoming_dose = ?1 WHERE name = ?2",
                    (&self.upcoming_dose.unwrap(), &self.name),
                )
                .unwrap();

                break;
            }
        }
    }

    pub fn update_schedule(
        &mut self,
        app: AppHandle,
        mut initial_dose: f64,
        interval: f64,
    ) -> String {
        // initial dose: 0-23
        // interval: 1-24
        // ? If you input whole numbers, i.e. 8.0, then it will return integers (1,2,3,4)
        let mut schedule_vec: Vec<String> = vec![];
        schedule_vec.push(initial_dose.to_string());
        let mut next_dosage;

        for _ in 0..((24.0 / interval) as i32 - 1) {
            if initial_dose + interval < 24.1 {
                next_dosage = initial_dose + interval;
            } else {
                next_dosage = (initial_dose + interval) - 24.0;
            }
            schedule_vec.push(next_dosage.to_string());
            initial_dose = next_dosage;
        }

        self.schedule = Some(schedule_vec.join(","));

        let app_data_dir = app.path().app_data_dir().unwrap();
        let conn = Connection::open(app_data_dir.join("iris.db")).unwrap();

        conn.execute(
            "UPDATE medication SET schedule = ?1 WHERE name = ?2",
            (&self.schedule, &self.name),
        )
        .unwrap();

        self.set_upcoming_dose(app); //updates the medication's upcoming_dose

        String::from(self.schedule.as_ref().unwrap())
    }
}
