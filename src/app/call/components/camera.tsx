"use client";
import classes from "./camera.module.css";
import Webcam from "react-webcam";

// Capturing video: https://codepen.io/mozmorris/pen/yLYKzyp?editors=0010

export default function Camera() {
  return (
    <div className={classes.camContainer}>
      <Webcam mirrored className={classes.cam} />;
    </div>
  );
}
