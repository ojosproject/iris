import { useState } from "react";
import { Medication } from "../types";
import styles from "./page.module.css";
import ScheduleForm from "../add_medication/components/schedule";


interface MedicationFormProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (newMedication: Medication) => Promise<void>;
}

const MedicationForm: React.FC<MedicationFormProps> = ({ isOpen, onClose, onSubmit }) => {
    const [medicationName, setMedicationName] = useState("");
    const [medicationGenericName, setMedicationGenericName] = useState("");
    const [medicationStrength, setMedicationStrength] = useState(0);
    const [medicationSupply, setMedicationSupply] = useState(0);
    const [selectedDosageType, setSelectedDosageType] = useState("");
    const [selectedUnits, setSelectedUnits] = useState("");
    const [selectedMedium, setSelectedMedium] = useState("");
    const [medicationFrequency, setMedicationFrequency] = useState("");
    const [medicationStartDate, setMedicationStartDate] = useState<string | undefined>(undefined);
    const [medicationEndDate, setMedicationEndDate] = useState<string | undefined>(undefined);
    const [medicationExpirationDate, setMedicationExpirationDate] = useState<string | undefined>(undefined);
    const [medicationNotes, setMedicationNotes] = useState("");

    const [selectedUnit, setSelectedUnit] = useState("custom");
    const [customUnit, setCustomUnit] = useState("");
    const [customMedium, setCustomMedium] = useState("");
    const [isShowSchedule, setShowSchedule] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        //console.log("Continue button clicked");
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
            start_date: medicationStartDate ? Date.parse(medicationStartDate) : undefined,
            end_date: medicationEndDate ? Date.parse(medicationEndDate) : undefined,
            expiration_date: medicationExpirationDate ? Date.parse(medicationExpirationDate) : undefined,
            frequency: medicationFrequency || undefined,
            notes: medicationNotes || undefined,
            medium: selectedMedium || undefined,
        };
        //await onSubmit(newMedication);
        setShowSchedule(true);
    };
    const handleScheduleSubmit = (newMedication: Medication) => {
        console.log("Scheduled Medication:", newMedication);
        setShowSchedule(false); // Close the schedule form after submitting
    };

    return (
        <>
            {isShowSchedule ? (
                // Render ScheduleForm as a separate page-like section
                <div className={styles.scheduleFormPage}>
                    <ScheduleForm
                        isOpen={isShowSchedule}
                        onClose={() => setShowSchedule(false)} // Use a function to close
                        onSubmit={handleScheduleSubmit}
                    />
                </div>
            ) : (
                <div className={styles.pageContainer}>
                    <div className={styles.pageContent}>
                        <h2>Add New Medication</h2>
                        <label className={styles.inputLabel}>
                            Medication Name
                        </label>
                        <input
                            type="text"
                            placeholder="Medication Name"
                            value={medicationName}
                            onChange={(e) => setMedicationName(e.target.value)}
                        />

                        <label className={styles.inputLabel}>
                            Generic Name
                        </label>
                        <input
                            type="text"
                            placeholder="Generic Name"
                            value={medicationGenericName}
                            onChange={(e) => setMedicationGenericName(e.target.value)}
                        />

                        <label className={styles.inputLabel}>
                            Dosage Strength
                        </label>
                        <input
                            type="number"
                            placeholder="0"
                            value={medicationStrength}
                            onChange={(e) => setMedicationStrength(Number(e.target.value))}
                        />

                        <div>
                            <label className={styles.inputLabel}>Dosage</label>
                            <div className={styles.dosageInputContainer}>
                                <input
                                    type="number"
                                    min="0"
                                    placeholder="0"
                                    className={styles.input}
                                />
                                <div className={styles.unitRow}>
                                    {selectedUnit === "custom" && (
                                        <div className={styles.customUnitContainer}>
                                            <input
                                                type="text"
                                                placeholder="unit"
                                                className={styles.customInput}
                                                value={customUnit}
                                                onChange={(e) => setCustomUnit(e.target.value)}
                                            />
                                        </div>
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
                            </div>
                            <label className={styles.inputLabel}>Medication Medium</label>
                            <div className={styles.dosageInputContainer}>
                                <div className={styles.unitRow}>
                                    {selectedMedium === "custom" && (
                                        <div className={styles.customUnitContainer}>
                                            <input
                                                type="text"
                                                placeholder="Medication Medium"
                                                className={styles.customInput}
                                                value={customMedium}
                                                onChange={(e) => setCustomMedium(e.target.value)}
                                            />
                                        </div>
                                    )}
                                    <div className={styles.unitOptions}>
                                        {["custom", "tablet", "pill", "injection"].map((medium) => (
                                            <button
                                                key={medium}
                                                className={`${styles.unitButton} ${selectedMedium === medium ? styles.selected : ""}`}
                                                onClick={() => setSelectedMedium(medium)}
                                            >
                                                {medium.charAt(0).toUpperCase() + medium.slice(1)}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div>
                                <label className={styles.inputLabel}>Quantity</label>
                                <div className={styles.quantityBox}>
                                    <input
                                        type="number"
                                        placeholder="0"
                                        value={medicationSupply}
                                        onChange={(e) => setMedicationSupply(Number(e.target.value))}
                                    />
                                    <span>{selectedUnit}</span>
                                </div>
                            </div>
                            <label className={styles.inputLabel}>
                                Expiration Date
                            </label>
                            <input
                                type="date"
                                placeholder="Expiration Date in MM/DD/YYYY"
                                value={medicationExpirationDate}
                                onChange={(e) => setMedicationExpirationDate(e.target.value)}
                            />

                            <div className={styles.buttonContainer}>
                                <button
                                    className={styles.submitButton}
                                    onClick={handleSubmit}
                                    disabled={
                                        medicationName === "" ||
                                        medicationStrength === 0 ||
                                        medicationSupply === 0
                                    }
                                >
                                    Continue
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default MedicationForm;
