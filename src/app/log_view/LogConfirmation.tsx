import React from "react";
import "./LogConfirmation.css";
import { MedicationLog } from "@/types";

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
    <div className="modalOverlay">
      <div className="modalContent">
        <h2>Log Confirmation</h2>
        <p>Are you sure you want to log this medication?</p>
        <div className="medicationDetails">
          <div className="logName">Name: {medicationName.medication_name}</div>
          <div className="logDosage">Dosage: {medicationName.given_dose}</div>
          {/*<div className="logFrequency">
            Frequency: {medicationName.medFrequency}
          </div>*/}
        </div>
        <div className="notificationSection">
          <p>Push Notification to:</p>
          <input
            type="text"
            placeholder="(###) ###-####"
            className="phoneNumberInput"
          />
        </div>
        <div className="buttonGroup">
          <button onClick={onConfirm}>Yes</button>
          <button onClick={onClose}>No</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
