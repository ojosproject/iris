/**
 * File:     onboarding/caregiver/page.tsx
 * Purpose:  Creates a caregiver during onboarding.
 * Authors:  Ojos Project & Iris contributors
 * License:  GNU General Public License v3.0
 */
"use client";
import styles from "../page.module.css";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import Layout from "@/components/Layout";

export default function OnboardingCaregiver() {
  const [caregiverName, setCaregiverName] = useState("");
  const router = useRouter();

  return (
    <Layout title=" ">
      <div className={styles.onboardingCenter}>
        <h3>Who will be the primary caregiver?</h3>
        <input
          type="text"
          value={caregiverName}
          className={styles.textInput}
          autoFocus={true} // auto focus when screen is active
          onChange={(e) => setCaregiverName(e.target.value)}
        />
        <div className={styles.buttonOnBottom}>
          <button
            className="primary"
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
          >
            Continue
          </button>
        </div>
      </div>
    </Layout>
  );
}
