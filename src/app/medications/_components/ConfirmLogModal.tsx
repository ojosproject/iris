/**
 * File:     ConfirmLogModal.tsx
 * Purpose:  Creates a popup to log a medication.
 * Authors:  Ojos Project & Iris contributors
 * License:  GNU General Public License v3.0
 */
import React, { useState } from "react";
import styles from "./ConfirmLogModal.module.css";
import { Medication } from "@/types/medications";

type ConfirmLogModalProps = {
  isOpen: boolean;
  title: string;
  onClose: () => void;
  onConfirm: (comment: string) => void;
  medication: Medication | null;
};

export default function ConfirmLogModal({
  isOpen,
  title,
  onClose,
  onConfirm,
  medication,
}: ConfirmLogModalProps) {
  const [comment, setComment] = useState("");
  const logSubmit = () => {
    onConfirm(comment);
    setComment("");
    onClose();
  };

  const handleClose = () => {
    setComment("");
    onClose();
  };

  if (!isOpen || !medication) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2>{title}</h2>
        <label>
          Add a comment (optional)
          <textarea
            placeholder="Example: Patient reacted well."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            style={{ margin: "1.2rem" }}
          />
        </label>
        <div className={styles.buttonGroup}>
          <button className="primary" onClick={logSubmit}>
            Yes
          </button>
          <button className="secondary" onClick={handleClose}>
            No
          </button>
        </div>
      </div>
    </div>
  );
}
