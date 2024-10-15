import Webcam from "react-webcam";
import classes from "./camera.module.css";
import { useRef, useState } from "react";

// Define the prop types for Camera
interface CameraProps {
  camOn: boolean;
  micOn: boolean;
}

export default function Camera({ camOn, micOn }: CameraProps) {
  const webcamRef = useRef<Webcam>(null);


  return (
    <div className={classes.camContainer}>
      {camOn && <Webcam ref={webcamRef} className={classes.cam} audio={micOn} />}
    </div>
  );
}
