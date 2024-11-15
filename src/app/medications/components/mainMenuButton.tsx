import Link from "next/link";
import styles from "./mainMenuButton.module.css"; // Import medView.css directly

export default function MainMenuButton() {
  return (
    <Link href="/">
      <button className={styles.back}>Back</button>
    </Link>
  );
}
