/**
 * File:     onboarding/caregiver/page.tsx
 * Purpose:  Creates a caregiver during onboarding.
 * Authors:  Ojos Project & Iris contributors
 * License:  GNU General Public License v3.0
 */
"use client";
import styles from "../Onboarding.module.css";
import Button from "@/components/Button";
import { useRouter } from "next/navigation";
import BackButton from "@/components/BackButton";
import { useState } from "react";
import { invoke } from "@tauri-apps/api/core";

export default function OnboardingCaregiver() {
  const [caregiverName, setCaregiverName] = useState("");
  const router = useRouter();

  return (
    <div className={styles.onboardingCenter}>
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
        className={styles.textInput}
        autoFocus={true} // auto focus when screen is active
        onChange={(e) => setCaregiverName(e.target.value)}
      />
      <div className={styles.buttonOnBottom}>
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
