/**
 * File:     HubToolButton.tsx
 * Purpose:  A button that navigates users to a tool from the Iris Hub.
 * Authors:  Ojos Project & Iris contributors
 * License:  GNU General Public License v3.0
 */
import Link from "next/link";
import styles from "./HubToolButton.module.css";
import { HubTool } from "../_types/hub";

export default function HubToolButton({ name, link, icon }: HubTool) {
  return (
    <Link href={link} className={styles.link} draggable={false}>
      <div className={styles.tool}>
        {icon ? (
          <img
            src={icon}
            height={200}
            width={200}
            style={{ borderRadius: "12px" }}
            alt={name}
            draggable={false}
          />
        ) : (
          <div className={styles.iconPlaceholder} />
        )}

        <h3> {name} </h3>
      </div>
    </Link>
  );
}
