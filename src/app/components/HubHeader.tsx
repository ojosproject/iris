"use client";
import classes from "./HubHeader.module.css";
import { useState } from "react";
import Clock from 'react-live-clock';

export default function HubHeader() {
  // todo: Possibly change these from useState to fetching from the backend for the user name and current time of day
  const [userName, setUserName] = useState("Name");
  const [timeOfDay, setTimeOfDay] = useState("morning");
  // todo: get current time
  // todo: change formatting in Clock element to have multiple lines

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
