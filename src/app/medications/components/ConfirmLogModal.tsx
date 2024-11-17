// ConfirmLogModal.tsx
// Ojos Project
//
// Creates a popup to log a medication.
import React from "react";
import styles from "./ConfirmLogModal.module.css";
import { Medication, MedicationLog } from "../types";

interface ConfirmLogModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  medication: Medication | null;
}

const ConfirmLogModal: React.FC<ConfirmLogModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  medication,
}) => {
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
        <div className={styles.buttonGroup}>
          <button onClick={onConfirm}>Yes</button>
          <button onClick={onClose}>No</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmLogModal;
