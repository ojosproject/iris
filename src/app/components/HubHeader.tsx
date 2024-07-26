'use client';
import classes from './HubHeader.module.css';
import { useState } from "react";

export default function HubHeader() {
  // todo: Possibly change these from useState to fetching from the backend for the user name and current time of day
    const [userName, setUserName] = useState("Name");
    const [timeOfDay, setTimeOfDay] = useState("morning");

  return (
    <header>
      <h1> Good {timeOfDay}, {userName} </h1>
    </header>
  );
}