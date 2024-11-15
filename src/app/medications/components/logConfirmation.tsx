import React from "react";
import styles from "./logConfirmation.module.css";
import { MedicationLog } from "../types";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  medicationName: MedicationLog | null;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  medicationName,
}) => {
  if (!isOpen || !medicationName) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2>Log Confirmation</h2>
        <p>Are you sure you want to log this medication?</p>
        <div className={styles.medicationDetails}>
          <div className={styles.logNam}>
            Name: {medicationName.medication_name}
          </div>
          <div className={styles.logDosage}>
            Dosage:{" "}
            {medicationName.given_dose.toString() + medicationName.measurement}
          </div>
          {/*<div className="logFrequency">
            Frequency: {medicationName.medFrequency}
          </div>*/}
        </div>
        <div className={styles.notificationSection}>
          <p>Push Notification to:</p>
          <input
            type="text"
            placeholder="(###) ###-####"
            className={styles.phoneNumberInput}
          />
        </div>
        <div className={styles.buttonGroup}>
          <button onClick={onConfirm}>Yes</button>
          <button onClick={onClose}>No</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
