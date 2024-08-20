"use client";
import classes from "./camera.module.css";
import Webcam from "react-webcam";

export default function Camera() {
  return (
    <div className={classes.camContainer}>
      <Webcam className={classes.cam} />;
    </div>
  );
}
