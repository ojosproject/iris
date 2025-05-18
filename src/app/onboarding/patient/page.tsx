/**
 * File:     onboarding/patient/page.tsx
 * Purpose:  Creates a patient during onboarding.
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
import Layout from "@/components/Layout";

export default function OnboardingPatient() {
  const [patientName, setPatientName] = useState("");
  const router = useRouter();

  return (
    <Layout title=" ">
      <div className={styles.onboardingCenter}>
        <h3>What is the patient's full name?</h3>
        <input
          type="text"
          value={patientName}
          className={styles.textInput}
          autoFocus={true} // auto focus when screen is active
          onChange={(e) => setPatientName(e.target.value)}
        />
        <div className={styles.buttonOnBottom}>
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
    </Layout>
  );
}
