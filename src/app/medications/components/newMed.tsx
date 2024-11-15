// This is the popup that appears when you select "Add Medication"
// Used by /medications/page.tsx

import React, { useState } from "react";
import { Medication, MedicationLog } from "../types";
import styles from "./newMed.module.css";

interface MedicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (newMedication: Medication) => void;
}

const MedicationModal: React.FC<MedicationModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [medicationName, setMedicationName] = useState("");
  const [medicationBrand, setMedicationBrand] = useState("");
  const [medicationDosage, setMedicationDosage] = useState(0);
  const [medicationFrequency, setMedicationFrequency] = useState(0);
  const [medicationSupply, setMedicationSupply] = useState(0);
  const [medicationMeasurement, setMedicationMeasurement] = useState("mg");
  const [medicationNurseId, setMedicationNurseId] = useState("");
  // Set timestamp to 0 by default
  //const [timestamp, setTimestamp] = useState(Date.now());

  const handleSubmit = () => {
    onSubmit({
      name: medicationName,
      brand: medicationBrand,
      dosage: medicationDosage,
      frequency: medicationFrequency,
      supply: medicationSupply,
      measurement: medicationMeasurement,
      nurse_id: medicationNurseId,
    } as Medication);
    onClose();

    setMedicationName("");
    setMedicationBrand("");
    setMedicationDosage(0);
    setMedicationFrequency(0);
    setMedicationSupply(0);
    setMedicationMeasurement("mg");
    setMedicationNurseId("");
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
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
          Brand:
          <input
            type="text"
            value={medicationBrand}
            onChange={(e) => {
              setMedicationBrand(e.target.value);
            }}
          ></input>
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
          style={
            medicationName === "" ||
            medicationBrand === "" ||
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

export default MedicationModal;
