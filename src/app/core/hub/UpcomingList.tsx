"use client"; // added for useState(). is there another way?

import { useEffect, useState } from "react";
import classes from "./UpcomingList.module.css";
import UpcomingMed from "../hub/UpcomingMed";
import { Medication } from "@/app/core/types";
import { invoke } from "@tauri-apps/api/core";

export default function UpcomingList() {
  const [upcomingMeds, setUpcomingMeds] = useState([] as Medication[]);

  useEffect(() => {
    // https://v2.tauri.app/develop/calling-rust/
    // ! the command requires a security credential
    // ! this will fail if no user inside the database exists with this credential
    // todo: implement a way to request a user be created
    invoke("get_upcoming_medications", { credential: null })
      .then((d) => {
        setUpcomingMeds(d as Medication[]);
      })
      .catch((e) => {
        // todo: can we create a way for errors to be displayed on screen?
        console.log(e);
      });
  }, []);

  return (
    <ul className={classes.medList}>
      {upcomingMeds.map((med) => {
        return (
          <li>
            <UpcomingMed
              time={med.upcoming_dose!} // guaranteed to have a value. if not, let backend know
              name={med.name}
            ></UpcomingMed>
          </li>
        );
      })}
    </ul>
  );
}
