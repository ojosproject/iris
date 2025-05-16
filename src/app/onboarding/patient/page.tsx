"use client";
import classes from "../Onboarding.module.css";
import Button from "@/components/Button";
import { useRouter } from "next/navigation";
import BackButton from "@/components/BackButton";
import { useState } from "react";
import { invoke } from "@tauri-apps/api/core";

export default function OnboardingPatient() {
  const [patientName, setPatientName] = useState("");
  const router = useRouter();

  return (
    <div className={classes.onboarding_center}>
      <BackButton
        onClick={() => {
          router.back();
        }}
        style={{ position: "fixed", top: 2, left: 2 }}
      />
      <h3>What is the patient's full name?</h3>
      <input
        type="text"
        value={patientName}
        className={classes.text_input}
        autoFocus={true} // auto focus when screen is active
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

            invoke("create_contact", {
              name: patientName,
              contact_type: "PATIENT",
              enabled_relay: false,
            }).then(() => {
              router.push("/onboarding/caregiver/");
            });
          }}
        />
      </div>
    </div>
  );
}
