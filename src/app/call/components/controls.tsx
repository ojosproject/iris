"use client";
import { useState } from "react";
import classes from "./controls.module.css";
import clsx from "clsx";

export default function Controls() {
    const [micOn, setMicOn] = useState(true);
    const [camOn, setCamOn] = useState(true);
    const [recOn, setRecOn] = useState(true);
  return (
    <div className={classes.controls}>
      <button className={ clsx(classes.normalButton)} > End </button>
      <button className={ clsx(classes.normalButton, !micOn && classes.invert)} onClick={() => setMicOn(!micOn)}> 
        {micOn && "Mute"}
        {!micOn && "Unmute"}
      </button>
      <button className={ clsx(classes.normalButton, !camOn && classes.invert)} onClick={() => setCamOn(!camOn)}>
        {camOn && "Turn Camera Off"}
        {!camOn && "Turn Camera On"}
      </button>
      <button className={ clsx(classes.normalButton, !recOn && classes.invert)} onClick={() => setRecOn(!recOn)}>
        {recOn && "Record"}
        {!recOn && "Stop Recording"}
      </button>
    </div>
  );
}
