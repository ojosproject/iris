/**
 * File:     ResourcesNotAvailableView.tsx
 * Purpose:  If there are no resources available, this page is displayed.
 * Authors:  Ojos Project & Iris contributors
 * License:  GNU General Public License v3.0
 */
import styles from "../page.module.css";
import Image from "next/image";

export default function ResourcesNotAvailableView() {
  return (
    <>
      <div className={styles.notFound}>
        <Image
          className={styles.notFoundIcon}
          src="/images/ionic/alert-circle-outline.svg"
          alt="Alert icon"
          width={100}
          height={100}
          draggable={false}
        />
        <p className={styles.notFoundText}>Sorry, no resources were found.</p>
        <p className={styles.notFoundText}>
          You can import resources in Settings.
        </p>
      </div>
    </>
  );
}
