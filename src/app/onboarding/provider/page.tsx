"use client";
import Layout from "@/components/Layout";
import styles from "./page.module.css";
import Link from "next/link";
import { completeOnboarding } from "@/utils/settings";

export default function Page() {
  return (
    <Layout title="Who's setting up Iris?" disabledBackButton={true}>
      <div className={styles.buttons}>
        <Link href="/onboarding/provider/basics">
          <img
            src={"/images/ionic/business-outline.svg"}
            alt="Business building icon"
            className={styles.icon}
            draggable={false}
          />
          <strong>A healthcare provider</strong>
          <p>Add branding to the software.</p>
        </Link>
        <Link
          onClick={async () => {
            await completeOnboarding("provider");
          }}
          href="/onboarding/"
        >
          <img
            src={"/images/ionic/person-circle-outline.svg"}
            alt="Person icon"
            className={styles.icon}
          />
          <strong>A patient or caregiver</strong>
          <p>Add the patient's details.</p>
        </Link>
      </div>
    </Layout>
  );
}
