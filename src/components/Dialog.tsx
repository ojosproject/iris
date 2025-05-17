/**
 * File:     Dialog.tsx
 * Purpose:  A universal dialog.
 * Authors:  Ojos Project & Iris contributors
 * License:  GNU General Public License v3.0
 */
import React from "react";
import styles from "./Dialog.module.css";

interface DialogProps {
  title: string;
  content: string;
  children: React.ReactNode;
  fadeOut?: number;
}

const Dialog: React.FC<DialogProps> = ({ title, content, children }) => {
  return (
    <div className={styles.dialogOverlay}>
      <div className={styles.dialogPopup}>
        <div className={styles.dialogHeader}>
          <h3>{title}</h3>
        </div>
        <div className={styles.dialogContent}>
          <p>{content}</p>
        </div>
        {children}
      </div>
    </div>
  );
};

export default Dialog;
