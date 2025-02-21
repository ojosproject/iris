import { useState } from "react";
import { Medication } from "../types";
import styles from "./page.module.css";


interface MedicationFormProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (newMedication: Medication) => Promise<void>;
}

const MedicationForm: React.FC<MedicationFormProps> = ({
    isOpen,
    onClose,
    onSubmit,
}) => {
    if (!isOpen) {
        return null;
    }

    // Group all medication data into one object
    const [medicationData, setMedicationData] = useState({
        medicationName: "",
        medicationGenericName: "",
        medicationStrength: 0,
        medicationSupply: 0,
        selectedDosageType: "",
        selectedUnits: "",
        selectedMedium: "",
        medicationFrequency: "",
        medicationStartDate: undefined as string | undefined,
        medicationEndDate: undefined as string | undefined,
        medicationExpirationDate: undefined as string | undefined,
        medicationNotes: "",
        selectedUnit: "custom",
        customUnit: "",
        customMedium: "",
    });

    // Handle input changes for each field
    const handleInputChange = (field: string, value: any) => {
        setMedicationData((prevData) => ({
            ...prevData,
            [field]: value,
        }));
    };

    const handleSubmit = () => {
        const newMedication: Medication = {
            id: crypto.randomUUID(),
            name: medicationData.medicationName,
            generic_name: medicationData.medicationGenericName || "",
            dosage_type: medicationData.selectedDosageType || "tablet",
            strength: medicationData.medicationStrength || 0,
            units: medicationData.selectedUnits || "mg",
            quantity: medicationData.medicationSupply,
            created_at: Date.now(),
            updated_at: Date.now(),
            start_date: medicationData.medicationStartDate
                ? Date.parse(medicationData.medicationStartDate)
                : undefined,
            end_date: medicationData.medicationEndDate
                ? Date.parse(medicationData.medicationEndDate)
                : undefined,
            expiration_date: medicationData.medicationExpirationDate
                ? Date.parse(medicationData.medicationExpirationDate)
                : undefined,
            frequency: medicationData.medicationFrequency || undefined,
            notes: medicationData.medicationNotes || undefined,
            medium: medicationData.selectedMedium || undefined,
        };

        // Call onSubmit with newMedication
        onSubmit(newMedication);
    };

    const [scheduleMedication, setScheduleMedication] = useState<boolean | null>(null);
    const [selectedDays, setSelectedDays] = useState<string[]>([]);
    const [times, setTimes] = useState<{ hour: string; minute: string; period: "AM" | "PM" }[]>([
        { hour: "", minute: "", period: "AM" },
    ]);

    const toggleDaySelection = (day: string) => {
        setSelectedDays((prev) =>
            prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
        );
    };

    const addTimeSlot = () => {
        setTimes([...times, { hour: "", minute: "", period: "AM" }]);
    };

    const updateTimeSlot = (index: number, field: string, value: string) => {
        const newTimes = [...times];
        newTimes[index] = { ...newTimes[index], [field]: value };
        setTimes(newTimes);
    };

    const removeTimeSlot = (index: number) => {
        const newTimes = times.filter((_, i) => i !== index);
        setTimes(newTimes);
    };

    return (
        <div className={styles.pageContainer}>
            <div className={styles.pageContent}>
                <h2>Add New Medication</h2>
                <p className={styles.textStructure}>
                    Medication Name
                </p>
                <input
                    className={styles.input}
                    type="text"
                    placeholder="Medication Name"
                    value={medicationData.medicationName}
                    onChange={(e) => handleInputChange("medicationName", e.target.value)}
                />
                <p className={styles.textStructure}>
                    Generic Name
                </p>
                <input
                    className={styles.input}
                    type="text"
                    placeholder="Generic Name"
                    value={medicationData.medicationGenericName}
                    onChange={(e) => handleInputChange("medicationGenericName", e.target.value)}
                />
                <p className={styles.textStructure}>
                    Dosage</p>
                <div className={styles.dosageInputContainer}>
                    <input
                        className={styles.input}
                        type="number"
                        placeholder="0"
                        value={medicationData.medicationStrength}
                        onChange={(e) => handleInputChange("medicationStrength", Number(e.target.value))}
                    />

                    <div className={styles.unitRow}>
                        {medicationData.selectedUnit === "Custom" && (
                            <input
                                type="text"
                                placeholder="unit"
                                className={`${styles.input} ${medicationData.selectedUnit === "Custom" ? styles.active : ""}`}
                                value={medicationData.customUnit}
                                onChange={(e) => handleInputChange("customUnit", e.target.value)}
                            />
                        )}

                        <div className={styles.unitOptions}>
                            {["Custom", "g", "mg", "mcg", "mL"].map((unit) => (
                                <button
                                    key={unit}
                                    className={`${styles.unitButton} ${medicationData.selectedUnit === unit ? styles.selected : ""}`}
                                    onClick={() => handleInputChange("selectedUnit", unit)}
                                >
                                    {unit}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
                <p className={styles.textStructure}>Medication Medium</p>
                <div className={styles.dosageInputContainer}>
                    <div className={styles.unitRow}>
                        {medicationData.selectedMedium === "Custom" && (
                            <input
                                type="text"
                                placeholder="Medication Medium"
                                className={`${styles.input} ${medicationData.selectedMedium === "Custom" ? styles.active : ""}`}
                                value={medicationData.customMedium}
                                onChange={(e) => handleInputChange("customMedium", e.target.value)}
                            />
                        )}
                        <div className={styles.unitOptions}>
                            {["Custom", "tablet", "capsule", "injection", "syrup"].map((medium) => (
                                <button
                                    key={medium}
                                    className={`${styles.unitButton} ${medicationData.selectedMedium === medium ? styles.selected : ""}`}
                                    onClick={() => handleInputChange("selectedMedium", medium)}
                                >
                                    {medium.charAt(0).toUpperCase() + medium.slice(1)}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
                <div>
                    <p className={styles.textStructure}>Quantity:</p>
                    <div className={styles.quantityBox}>
                        <input
                            type="number"
                            placeholder="0"
                            value={medicationData.medicationSupply}
                            onChange={(e) => handleInputChange("medicationSupply", Number(e.target.value))}
                            className={styles.input}
                        />
                        <span>{medicationData.selectedUnit}</span>
                    </div>
                </div>
                <p className={styles.textStructure}>
                    Expiration Date</p>
                <input
                    className={styles.input}
                    type="date"
                    placeholder="Expiration Date in MM/DD/YYYY"
                    value={medicationData.medicationExpirationDate}
                    onChange={(e) => handleInputChange("medicationExpirationDate", e.target.value)}
                />
                <p className={styles.textStructure}>Would you like to add scheduling for this medication?</p>
                <div className={styles.yesNoButtons}>
                    <button
                        className={scheduleMedication === true ? styles.selected : ""}
                        onClick={() => setScheduleMedication(true)}
                    >
                        Yes
                    </button>
                    <button
                        className={scheduleMedication === false ? styles.selected : ""}
                        onClick={() => setScheduleMedication(false)}
                    >
                        No
                    </button>
                </div>
                <p className={styles.textStructure}>Select Days</p>
                <div className={`${styles.scheduleDetails} ${scheduleMedication ? "" : styles.disabled}`}>
                    <div className={styles.daySelection}>
                        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                            <button
                                key={day}
                                className={`${selectedDays.includes(day) ? styles.selected : ""} ${!scheduleMedication ? styles.disabledButton : ""}`}
                                onClick={() => scheduleMedication && toggleDaySelection(day)}
                                disabled={!scheduleMedication}
                            >
                                {day}
                            </button>
                        ))}
                    </div>
                    <p className={styles.textStructure}>Select Time</p>
                    {times.map((time, index) => (
                        <div key={index} className={`${styles.timeSelection} ${!scheduleMedication ? styles.disabled : ""}`}>
                            <input
                                type="number"
                                min="1"
                                max="12"
                                placeholder="HH"
                                value={time.hour}
                                onChange={(e) => scheduleMedication && updateTimeSlot(index, "hour", e.target.value)}
                                disabled={!scheduleMedication}
                            />
                            <input
                                type="number"
                                min="0"
                                max="59"
                                placeholder="MM"
                                value={time.minute}
                                onChange={(e) => scheduleMedication && updateTimeSlot(index, "minute", e.target.value)}
                                disabled={!scheduleMedication}
                            />
                            <select
                                value={time.period}
                                onChange={(e) => scheduleMedication && updateTimeSlot(index, "period", e.target.value)}
                                disabled={!scheduleMedication}
                            >
                                <option>AM</option>
                                <option>PM</option>
                            </select>

                            <button
                                className={styles.removeTimeButton}
                                onClick={() => removeTimeSlot(index)}
                                disabled={!scheduleMedication}
                            >
                                X
                            </button>
                        </div>
                    ))}
                    <button
                        className={styles.addTimeButton}
                        onClick={addTimeSlot}
                        disabled={!scheduleMedication}
                    >
                        + Add Another Time
                    </button>
                </div>
                <div className={styles.modalActions}>
                    <button className={styles.cancelButton} onClick={onClose}>
                        Previous
                    </button>
                    <button
                        disabled={
                            medicationData.medicationName === "" ||
                            medicationData.medicationStrength === 0 ||
                            medicationData.medicationSupply === 0
                        }
                        onClick={handleSubmit}
                        className={styles.submitButton}
                    >
                        Add Medication
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MedicationForm;
