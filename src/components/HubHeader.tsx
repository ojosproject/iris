/**
 * File:     HubHeader.tsx
 * Purpose:  Header for the Hub. Includes the patient name and current time.
 * Authors:  Ojos Project & Iris contributors
 * License:  GNU General Public License v3.0
 */
"use client";
import styles from "./HubHeader.module.css";
import { daysOfWeek, getTimeOfDay, timestampToString } from "@/utils/parsing";
import { useEffect, useState } from "react";
import { getPatientContact } from "@/utils/contacts";

export default function HubHeader() {
  const [userName, setUserName] = useState("Name");
  const [timeOfDay, setTimeOfDay] = useState("morning");
  const date = new Date();
  const epoch = date.getTime() / 1000;

  useEffect(() => {
    async function initPage() {
      const contact = await getPatientContact();

      if (contact.contact_type === "PATIENT") {
        setUserName(contact.name.split(" ")[0]);
      }
    }

    initPage();
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
        <span className={styles.hourMin}>
          {timestampToString(epoch, "HH:MM XX")}
        </span>
        <span className={styles.date}>{timestampToString(epoch)}</span>
        <span className={styles.date}>{daysOfWeek[date.getDay()]}</span>
      </div>
    </header>
  );
}
