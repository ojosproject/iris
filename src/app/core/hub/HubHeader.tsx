"use client";
import { invoke } from "@tauri-apps/api/core";
import classes from "./HubHeader.module.css";
import { useEffect, useState } from "react";
import Clock from "react-live-clock";
import { User } from "@/app/core/types";

function get_time_of_day(): "morning" | "afternoon" | "evening" {
  // Remember that Date.getHours() returns in 24-hour format
  let hour = new Date().getHours();

  if (hour >= 17) {
    return "evening";
  } else if (hour >= 12 && hour < 17) {
    return "afternoon";
  }
  return "morning";
}

export default function HubHeader() {
  const [userName, setUserName] = useState("Name");
  const [timeOfDay, setTimeOfDay] = useState("morning");
  // todo: change formatting in Clock element to have multiple lines

  useEffect(() => {
    invoke("get_patient_info").then((user) => {
      setUserName((user as User).full_name.split(" ")[0]);
    });

    setTimeOfDay(get_time_of_day());
  }, [userName]);

  return (
    <header className={classes.head}>
      <div className={classes.iris}>
        <p>iris</p>
      </div>
      <div className={classes.greeting}>
        <h1>
          Good {timeOfDay}, {userName}
        </h1>
      </div>
      <div className={classes.time}>
        {/* <p>insert current time</p> */}
        <Clock format={"h:mm A"} ticking className={classes.hourMin} />
        <Clock format={"MMM D, YYYY"} ticking className={classes.date} />
        <Clock format={"dddd"} ticking className={classes.date} />
      </div>
    </header>
  );
}
