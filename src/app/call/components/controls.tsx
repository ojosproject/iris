"use client";
import { useRef, useState } from "react";
import classes from "./controls.module.css";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import React from "react";
import Webcam from "react-webcam";

interface ControlsProps {
  camOn: boolean;
  setCamOn: (state: boolean) => void;
  micOn: boolean;
  setMicOn: (state: boolean) => void;
}

export default function Controls({
  camOn,
  setCamOn,
  micOn,
  setMicOn,
}: ControlsProps) {
  const [recOn, setRecOn] = useState(true);
  const router = useRouter();

  return (
    <div className={classes.controls}>
      <button
        className={clsx(classes.normalButton)}
        onClick={() => router.push("/")}
      >
        {" "}
        End{" "}
      </button>
      <button
        className={clsx(classes.normalButton, !micOn && classes.invert)}
        onClick={() => setMicOn(!micOn)}
      >
        {micOn && "Mute"}
        {!micOn && "Unmute"}
      </button>
      <button
        className={clsx(classes.normalButton, !camOn && classes.invert)}
        onClick={() => setCamOn(!camOn)}
      >
        {camOn && "Turn Camera On"}
        {!camOn && "Turn Camera off"}
      </button>
      <button
        className={clsx(classes.normalButton, !recOn && classes.invert)}
        onClick={() => setRecOn(!recOn)}
      >
        {recOn && "Record"}
        {!recOn && "Stop Recording"}
      </button>
    </div>
  );
}
