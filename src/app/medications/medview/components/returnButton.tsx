import Link from "next/link";
import styles from "./returnButton.module.css";

export default function MedicationLogButton() {
  return (
    <Link
      href={{
        pathname: "/medication/",
      }}
    >
      <button className={styles.back}>Back</button>
    </Link>
  );
}
