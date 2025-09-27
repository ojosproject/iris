/**
 * File:     settings/_components/SettingsSection.tsx
 * Purpose:  Provides a neat layout for settings.
 * Authors:  Ojos Project & Iris contributors
 * License:  GNU General Public License v3.0
 */
import { ReactNode } from "react";
import styles from "./SettingsSection.module.css";

export default function SettingSection({
  label,
  description,
  children,
}: {
  label: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <section className={styles.section}>
      <div className={styles.information}>
        <h2>{label}</h2>
        <p>{description}</p>
      </div>
      <div className={styles.extra}>{children}</div>
    </section>
  );
}
