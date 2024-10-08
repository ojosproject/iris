import Webcam from "react-webcam";
import classes from "./camera.module.css";

// Define the prop types for Camera
interface CameraProps {
  camOn: boolean;
  micOn: boolean;
  setMicOn: (value: boolean) => void;
}

export default function Camera({ camOn, micOn }: CameraProps) {
  return (
    <div className={classes.camContainer}>
      {camOn && <Webcam mirrored className={classes.cam} audio={micOn} />}
    </div>
  );
}
