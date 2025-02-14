// ConfirmLogModal.tsx
// Ojos Project
//
// Creates a popup to log a medication.
import React, { useState } from "react";
import styles from "./ConfirmLogModal.module.css";
import { Medication, MedicationLog } from "../types";

interface ConfirmLogModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (comment: string) => void;
  medication: Medication | null;
}

const ConfirmLogModal: React.FC<ConfirmLogModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  medication,
}) => {
  const [comment, setComment] = useState("");
  const logSubmit = () => {
    onConfirm(comment);
    onClose();
  };

  if (!isOpen || !medication) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2>Log Confirmation</h2>
        <p>
          Log{" "}
          <strong>
            {medication.name} {medication.dosage}
            {medication.measurement}
          </strong>
          ?
        </p>
        <textarea
          className={styles.commentBox}
          placeholder="Add a comment (optional)"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <div className={styles.buttonGroup}>
          <button onClick={() => onConfirm(comment)}>Yes</button>
          <button onClick={onClose}>No</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmLogModal;
