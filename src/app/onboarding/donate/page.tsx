/**
 * File:     onboarding/donate.tsx
 * Purpose:  A CTA to donate to Ojos Project.
 * Authors:  Ojos Project & Iris contributors
 * License:  GNU General Public License v3.0
 */
"use client";
import Link from "next/link";
import styles from "./page.module.css";
import QRCode from "react-qr-code";

export default function Page() {
  return (
    <div className={styles.donateContainer}>
      <section className={styles.textAndButtons}>
        <h3>Help us make Iris better.</h3>
        <p>
          Iris is built and maintained by volunteers at the Ojos Project. Your
          donations helps us create open, affordable technology that serves
          communities everywhere.
        </p>

        <Link className="linkButton" href="/">
          <button className="primary">Done</button>
        </Link>
      </section>
      <section className={styles.qrContainer}>
        <QRCode value="https://ko-fi.com/ojosproject" />
        <p>Scan the QR code to donate and support our work.</p>
      </section>
    </div>
  );
}
