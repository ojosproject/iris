// NewMedicationModal.tsx
// Ojos Project
//
// A popup that appears to create a new medication.
import React, { useEffect, useState } from "react";
import { Medication } from "../types";
import styles from "./NewMedicationModal.module.css";
import useKeyPress from "@/app/accessibility/keyboard_nav";

interface NewMedicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (newMedication: Medication) => void;
}

const NewMedicationModal: React.FC<NewMedicationModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [medicationName, setMedicationName] = useState("");
  const [medicationDosage, setMedicationDosage] = useState(0);
  const [medicationFrequency, setMedicationFrequency] = useState(0);
  const [medicationSupply, setMedicationSupply] = useState(0);
  const [medicationMeasurement, setMedicationMeasurement] = useState("mg");
  const [medicationNurseId, setMedicationNurseId] = useState("");
  // Set timestamp to 0 by default
  //const [timestamp, setTimestamp] = useState(Date.now());

  const isFormValid =
    medicationName.trim() !== "" &&
    medicationDosage > 0 &&
    medicationSupply > 0;

  const handleSubmit = () => {
    if (!isFormValid) return;

    onSubmit({
      name: medicationName,
      dosage: medicationDosage,
      frequency: medicationFrequency,
      supply: medicationSupply,
      measurement: medicationMeasurement,
      nurse_id: medicationNurseId,
      total_prescribed: 0,
      first_added: 0
    });

    onClose();
    setMedicationName("");
    setMedicationDosage(0);
    setMedicationFrequency(0);
    setMedicationSupply(0);
    setMedicationMeasurement("mg");
    setMedicationNurseId("");
  };

  useKeyPress("Enter", (event) => {
    if (isOpen && isFormValid) {
      event.preventDefault();
      handleSubmit();
    }
  });

  if (!isOpen) return null;

  return (
    <div className={styles.modal}>
      <div className={styles.modalContent} id="new-medication-form">
        <h2>Add New Medication</h2>
        <label>
          Medication Name:
          <input
            type="text"
            value={medicationName}
            onChange={(e) => setMedicationName(e.target.value)}
          />
        </label>
        <label>
          Dosage:
          <input
            type="number"
            value={medicationDosage}
            onChange={(e) => setMedicationDosage(Number(e.target.value))}
          />
        </label>
        <label>
          Measurement:
          <select onChange={(e) => setMedicationMeasurement(e.target.value)}>
            <option value="mg">mg</option>
            <option value="ml">ml</option>
          </select>
        </label>
        <label>
          Supply:
          <input
            type="number"
            value={medicationSupply}
            onChange={(e) => setMedicationSupply(Number(e.target.value))}
          />
        </label>

        {/* Timestamp input can be omitted or set to default */}
        {/* <label>
                    Timestamp:
                    <input
                        type="datetime-local"
                        value={new Date(timestamp).toISOString().slice(0, -1)}
                        onChange={(e) => setTimestamp(new Date(e.target.value).getTime())}
                    />
                </label> */}
        <button
          className={styles.submitButton}
          onClick={handleSubmit}
          disabled={
            medicationName === "" ||
            medicationDosage === 0 ||
            medicationSupply === 0
          }
          style={
            medicationName === "" ||
            medicationDosage === 0 ||
            medicationSupply === 0
              ? { backgroundColor: "grey" }
              : {}
          }
        >
          Submit
        </button>
        <button className={styles.cancelButton} onClick={onClose}>
          Cancel
        </button>
      </div>
    </div>
  );
};

export default NewMedicationModal;
