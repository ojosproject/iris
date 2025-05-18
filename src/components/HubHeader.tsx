/**
 * File:     HubHeader.tsx
 * Purpose:  Header for the Hub. Includes the patient name and current time.
 * Authors:  Ojos Project & Iris contributors
 * License:  GNU General Public License v3.0
 */
"use client";
import { invoke } from "@tauri-apps/api/core";
import styles from "./HubHeader.module.css";
import { getTimeOfDay } from "@/utils/parsing";
import { useEffect, useState } from "react";
import Clock from "react-live-clock";
import { Contact } from "@/types/contacts";

export default function HubHeader() {
  const [userName, setUserName] = useState("Name");
  const [timeOfDay, setTimeOfDay] = useState("morning");

  useEffect(() => {
    invoke<Contact>("get_patient_contact").then((contact) => {
      if (contact.contact_type === "PATIENT") {
        setUserName(contact.name.split(" ")[0]);
      }
    });

    setTimeOfDay(getTimeOfDay());
  }, [userName]);

  return (
    <header className={styles.head}>
      <div className={styles.iris}>
        <p>iris</p>
      </div>
      <div className={styles.greeting}>
        <h1>
          Good {timeOfDay}, {userName}
        </h1>
      </div>
      <div className={styles.time}>
        {/* <p>insert current time</p> */}
        <Clock format={"h:mm A"} ticking className={styles.hourMin} />
        <Clock format={"MMM D, YYYY"} ticking className={styles.date} />
        <Clock format={"dddd"} ticking className={styles.date} />
      </div>
    </header>
  );
}
