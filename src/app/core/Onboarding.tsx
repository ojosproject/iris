import { useState } from "react";
import Button from "./components/Button";
import classes from "../core/Onboarding.module.css";
import { invoke } from "@tauri-apps/api/core";
import BackButton from "./components/BackButton";

export default function Onboarding(props: {
  handleCompletedOnboarding: Function;
}) {
  const [onScreen, setOnScreen] = useState(0);
  const [patientName, setPatientName] = useState("");
  const SCREEN_WELCOME = (
    <div className={classes.onboarding_center}>
      <h1>Welcome to Iris!</h1>
      <h3>Your care management system</h3>

      <div className={classes.button_on_bottom}>
        <Button
          type="PRIMARY"
          label="Get Started"
          onClick={() => {
            setOnScreen(1);
          }}
        />
      </div>
    </div>
  );
  const SCREEN_PATIENT_NAME = (
    <div className={classes.onboarding_center}>
      <BackButton
        onClick={() => {
          setOnScreen(0);
        }}
        style={{ position: "fixed", top: 2, left: 2 }}
      />
      <h3>What is the patient's full name?</h3>
      <input
        type="text"
        value={patientName}
        className={classes.text_input}
        autoFocus={onScreen === 1} // auto focus when screen is active
        onChange={(e) => setPatientName(e.target.value)}
      />
      <div className={classes.button_on_bottom}>
        <Button
          type="PRIMARY"
          label="Continue"
          disabled={patientName === ""}
          onClick={() => {
            if (patientName === "") {
              return;
            }

            setOnScreen(2);
          }}
        />
      </div>
    </div>
  );

  const SCREEN_COMPLETED = (
    <div className={classes.onboarding_center}>
      <BackButton
        onClick={() => {
          setOnScreen(1);
        }}
        style={{ position: "fixed", top: 2, left: 2 }}
      />
      <h3>Onboarding completed!</h3>
      <div className={classes.button_on_bottom}>
        <Button
          type="PRIMARY"
          label="Finish"
          onClick={() => {
            invoke("create_user", { name: patientName, user_type: "PATIENT" });
            props.handleCompletedOnboarding();
          }}
        />
      </div>
    </div>
  );

  const SCREENS = [SCREEN_WELCOME, SCREEN_PATIENT_NAME, SCREEN_COMPLETED];

  return SCREENS[onScreen];
}
