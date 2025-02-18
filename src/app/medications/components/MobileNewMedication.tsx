import { use, useState } from "react";
import { Medication } from "../types";
import styles from "./MobileNewMedication.module.css";
import ScheduleForm from "./ScheduleRequest";

interface MobileNewMedication {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (newMedication: Medication) => void;
}

const MedicationForm: React.FC<MobileNewMedication> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [medicationName, setMedicationName] = useState("");
  const [medicationGenericName, setMedicationGenericName] = useState("");
  const [medicationStrength, setMedicationStrength] = useState(0);
  const [medicationSupply, setMedicationSupply] = useState(0);
  const [selectedDosageType, setSelectedDosageType] = useState("");
  const [selectedUnits, setSelectedUnits] = useState("");
  const [selectedMedium, setSelectedMedium] = useState("");
  const [medicationFrequency, setMedicationFrequency] = useState("");
  const [medicationStartDate, setMedicationStartDate] = useState<
    string | undefined
  >(undefined);
  const [medicationEndDate, setMedicationEndDate] = useState<
    string | undefined
  >(undefined);
  const [medicationExpirationDate, setMedicationExpirationDate] = useState<
    string | undefined
  >(undefined);
  const [medicationNotes, setMedicationNotes] = useState("");

  const [selectedUnit, setSelectedUnit] = useState("custom");
  const [customUnit, setCustomUnit] = useState("");
  const [customMedium, setCustomMedium] = useState("");

  const [showNextModal, setShowNextModal] = useState(false);

  const handleSubmit = () => {
    //console.log("Continue button clicked 1");
    if (!medicationName || !medicationSupply) {
      alert("Please fill in all required fields.");
      return;
    }

    const newMedication: Medication = {
      id: crypto.randomUUID(),
      name: medicationName,
      generic_name: medicationGenericName || "",
      dosage_type: selectedDosageType || "tablet",
      strength: medicationStrength || 0,
      units: selectedUnits || "mg",
      quantity: medicationSupply,
      created_at: Date.now(),
      updated_at: Date.now(),
      start_date: medicationStartDate
        ? Date.parse(medicationStartDate)
        : undefined,
      end_date: medicationEndDate ? Date.parse(medicationEndDate) : undefined,
      expiration_date: medicationExpirationDate
        ? Date.parse(medicationExpirationDate)
        : undefined,
      frequency: medicationFrequency || undefined, // Optional?
      notes: medicationNotes || undefined,
      medium: selectedMedium || undefined, //added to @types also
    };

    //console.log("Continue button clicked 2");

    setShowNextModal(true);
  };

  return (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        <h2>Add New Medication</h2>
        <label>
          Medication Name:
          <input
            type="text"
            placeholder="Medication Name"
            value={medicationName}
            onChange={(e) => setMedicationName(e.target.value)}
          />
        </label>
        <label>
          Generic Name:
          <input
            type="text"
            placeholder="Generic Name"
            value={medicationGenericName}
            onChange={(e) => setMedicationGenericName(e.target.value)}
          />
        </label>
        <label>
          Dosage Strength:
          <input
            type="number"
            placeholder="0"
            value={medicationStrength}
            onChange={(e) => setMedicationStrength(Number(e.target.value))}
          />
        </label>
        {/* Look at these Dosage related stuff */}
        <div>
          <label>Dosage</label>
          <input type="number" min="0" placeholder="0" />

          {selectedUnit === "custom" && (
            <input
              type="text"
              placeholder="unit"
              className={`${styles.customInput} ${selectedUnit === "custom" ? styles.active : ""}`}
              value={customUnit}
              onChange={(e) => setCustomUnit(e.target.value)}
            />
          )}

          <div className={styles.unitOptions}>
            {["custom", "g", "mg", "mcg", "mL"].map((unit) => (
              <button
                key={unit}
                className={`${styles.unitButton} ${selectedUnit === unit ? styles.selected : ""}`}
                onClick={() => setSelectedUnit(unit)}
              >
                {unit}
              </button>
            ))}
          </div>
        </div>
        <label>Medication Medium</label>
        <input type="text" placeholder="Medication Medium" />
        {selectedMedium === "custom" && (
          <input
            type="text"
            placeholder="Medication Medium"
            className={`${styles.customInput} ${selectedMedium === "custom" ? styles.active : ""}`}
            value={customMedium}
            onChange={(e) => setCustomMedium(e.target.value)}
          />
        )}
        <div className={styles.unitOptions}>
          {["custom", "tablet", "capsule", "injection", "syrup"].map(
            (medium) => (
              <button
                key={medium}
                className={`${styles.unitButton} ${selectedMedium === medium ? styles.selected : ""}`}
                onClick={() => setSelectedMedium(medium)}
              >
                {medium.charAt(0).toUpperCase() + medium.slice(1)}
              </button>
            ),
          )}
        </div>
        <div>
          <label>Quantity:</label>
          {/* TODO: change the size of the input box */}
          <div className={styles.quantityBox}>
            <input
              type="number"
              placeholder="0"
              value={medicationSupply}
              onChange={(e) => setMedicationSupply(Number(e.target.value))}
              className={styles.quantityBox}
            />
            {/* Display the selected unit next to the quantity */}
            <span>{selectedUnit}</span>
          </div>
        </div>
        <label>
          Expiration Date:
          <input
            type="date"
            placeholder="Expiration Date in MM/DD/YYYY"
            value={medicationExpirationDate}
            onChange={(e) => setMedicationExpirationDate(e.target.value)}
          />
        </label>
        <div className={styles.buttonContainer}>
          <button className={styles.cancelButton} onClick={onClose}>
            Cancel
          </button>
          <button
            className={styles.submitButton}
            onClick={handleSubmit}
            onMouseDown={() => console.log("Mouse down on Continue!")}
            disabled={
              medicationName === "" ||
              medicationStrength === 0 ||
              medicationSupply === 0
            }
          >
            Continue
          </button>
        </div>
        {/* Show Next Modal */}
        {showNextModal && (
          <ScheduleForm
            isOpen={showNextModal}
            onClose={() => setShowNextModal(false)}
            onSubmit={(newMedication) => {
              console.log("Scheduled Medication:", newMedication);
              setShowNextModal(false);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default MedicationForm;
