/**
 * File:     onboarding/complete/page.tsx
 * Purpose:  Tells people the onboarding process is completed.
 * Authors:  Ojos Project & Iris contributors
 * License:  GNU General Public License v3.0
 */
"use client";
import styles from "../Onboarding.module.css";
import Button from "@/components/Button";
import { useRouter } from "next/navigation";
import { invoke } from "@tauri-apps/api/core";
import Layout from "@/components/Layout";

export default function OnboardingComplete() {
  const router = useRouter();
  return (
    <Layout title=" ">
      <div className={styles.onboardingCenter}>
        <h3>Onboarding completed!</h3>
        <div className={styles.buttonOnBottom}>
          <Button
            type="PRIMARY"
            label="Finish"
            onClick={() => {
              invoke("complete_onboarding").then(() => {
                router.push("/");
              });
            }}
          />
        </div>
      </div>
    </Layout>
  );
}
