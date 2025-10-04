/**
 * File:     onboarding/patient/page.tsx
 * Purpose:  Creates a patient during onboarding.
 * Authors:  Ojos Project & Iris contributors
 * License:  GNU General Public License v3.0
 */
"use client";
import styles from "../page.module.css";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Layout from "@/components/Layout";
import { createContact } from "@/utils/contacts";

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
          <button
            className="primary"
            disabled={patientName === ""}
            onClick={async () => {
              if (patientName === "") {
                return;
              }

              await createContact(
                patientName,
                undefined,
                undefined,
                undefined,
                "PATIENT",
                false,
              );

              router.push("/onboarding/caregiver/");
            }}
          >
            Continue
          </button>
        </div>
      </div>
    </Layout>
  );
}
