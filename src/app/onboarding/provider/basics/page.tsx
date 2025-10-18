"use client";
import Layout from "@/components/Layout";
import styles from "./page.module.css";
import { useState } from "react";
import Link from "next/link";

export default function Page() {
  const [orgName, setOrgName] = useState("");
  const [orgImage, setOrgImage] = useState("");

  return (
    <Layout title="Basic information">
      <section className={styles.iconAndInfo}>
        <div className={styles.basics}>
          <h2>Your organization</h2>
          <p>We'll use this information to apply branding to the software.</p>
          <label>
            Organization Name
            <input
              type="text"
              value={orgName}
              onChange={(e) => setOrgName(e.target.value)}
            />
          </label>
          <label>
            Organization Header
            {orgImage ? (
              <img
                src={orgImage}
                alt={`Branding header for ${orgName ? orgName : "the organization"}`}
                className={styles.orgHeaderPreview}
              />
            ) : (
              <input
                type="file"
                accept="image/*"
                value={orgImage}
                onChange={(picker) => {
                  const files = picker.target.files;
                  if (files?.length) {
                    setOrgImage(URL.createObjectURL(files[0]));
                  }
                }}
              />
            )}
          </label>
        </div>
        <img
          src={"/images/ionic/business-outline.svg"}
          alt="Business building icon"
          className={styles.icon}
          draggable={false}
        />
      </section>
      <section className={styles.buttons}>
        <div className={styles.buttonsContainer}>
          <Link href="/onboarding/provider/features">
            <button className="primary" disabled={orgName === ""}>
              Next
            </button>
          </Link>
          {orgImage === "" && (
            <p>
              Continuing without an organization header will instead use the
              Ojos Project header.
            </p>
          )}
        </div>
      </section>
    </Layout>
  );
}
