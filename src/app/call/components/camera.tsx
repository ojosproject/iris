import Webcam from "react-webcam";
import classes from "./camera.module.css";

// Define the prop types for Camera
interface CameraProps {
  camOn: boolean;
}

export default function Camera({ camOn }: CameraProps) {
  return (
    <div className={classes.camContainer}>
      {camOn && <Webcam mirrored className={classes.cam} />} 
    </div>
  );
}
