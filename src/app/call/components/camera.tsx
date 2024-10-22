import Webcam from "react-webcam";
import classes from "./camera.module.css";
import { useRef, useState } from "react";
import WebcamRecorder from "./controls";

export default function Camera() {

  return (
    <div className={classes.camContainer}>
      <WebcamRecorder />
    </div>
  );
}
