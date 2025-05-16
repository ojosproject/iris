"use client";
import classes from "../Onboarding.module.css";
import Button from "@/components/Button";
import { useRouter } from "next/navigation";
import BackButton from "@/components/BackButton";
import { useState } from "react";
import { invoke } from "@tauri-apps/api/core";

export default function OnboardingCaregiver() {
  const [caregiverName, setCaregiverName] = useState("");
  const router = useRouter();

  return (
    <div className={classes.onboarding_center}>
      <BackButton
        onClick={() => {
          router.back();
        }}
        style={{ position: "fixed", top: 2, left: 2 }}
      />
      <h3>Who will be the primary caregiver?</h3>
      <input
        type="text"
        value={caregiverName}
        className={classes.text_input}
        autoFocus={true} // auto focus when screen is active
        onChange={(e) => setCaregiverName(e.target.value)}
      />
      <div className={classes.button_on_bottom}>
        <Button
          type="PRIMARY"
          label="Continue"
          disabled={caregiverName === ""}
          onClick={() => {
            if (caregiverName === "") {
              return;
            }

            invoke("create_contact", {
              name: caregiverName,
              contact_type: "CAREGIVER",
              enabled_relay: false,
            }).then(() => {
              router.push("/onboarding/complete");
            });
          }}
        />
      </div>
    </div>
  );
}
