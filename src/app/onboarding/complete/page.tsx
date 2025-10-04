/**
 * File:     onboarding/complete/page.tsx
 * Purpose:  Tells people the onboarding process is completed.
 * Authors:  Ojos Project & Iris contributors
 * License:  GNU General Public License v3.0
 */
"use client";
import styles from "../page.module.css";
import { useRouter } from "next/navigation";
import Layout from "@/components/Layout";
import { completeOnboarding } from "@/utils/settings";

export default function OnboardingComplete() {
  const router = useRouter();
  return (
    <Layout title=" ">
      <div className={styles.onboardingCenter}>
        <h3>Onboarding completed!</h3>
        <div className={styles.buttonOnBottom}>
          <button
            className="primary"
            onClick={async () => {
              await completeOnboarding();
              router.push("/onboarding/donate/");
            }}
          >
            Continue
          </button>
        </div>
      </div>
    </Layout>
  );
}
