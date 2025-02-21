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
        <h2>Log Confirmation</h2>
        <p>
          Log{" "}
          <strong>
            {medication.name} {medication.strength.toString() + " " + medication.units}
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
          <button onClick={logSubmit}>Yes</button>
          <button onClick={handleClose}>No</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmLogModal;
