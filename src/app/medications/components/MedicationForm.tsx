"use client";
import { useState } from "react";
import { Medication } from "../types";
import styles from "./MedicationForm.module.css";
import MedicationIconPicker from "../components/MedicationIconPicker";
import { platform } from "@tauri-apps/plugin-os";

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
    selectedDosageType: "tablet", // default to pills so that the icons are displayed
    medicationFrequency: "",
    medicationStartDate: undefined as string | undefined,
    medicationEndDate: undefined as string | undefined,
    medicationExpirationDate: "",
    medicationNotes: "",
    selectedUnit: "mg",
    customUnit: "",
    customMedium: "",
    icon: "",
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
      dosage_type:
        medicationData.selectedDosageType ||
        medicationData.customMedium ||
        "tablet",
      strength: medicationData.medicationStrength || 0,
      units: medicationData.selectedUnit || medicationData.customUnit || "mg",
      quantity: medicationData.medicationSupply,
      created_at: Date.now(),
      updated_at: Date.now(),
      start_date: medicationData.medicationStartDate
        ? Date.parse(medicationData.medicationStartDate)
        : undefined,
      end_date: medicationData.medicationEndDate
        ? Date.parse(medicationData.medicationEndDate)
        : undefined,
      expiration_date: medicationData.medicationExpirationDate.length
        ? Date.parse(medicationData.medicationExpirationDate)
        : undefined,
      frequency: medicationData.medicationFrequency || undefined,
      notes: medicationData.medicationNotes || undefined,
      icon: medicationData.icon,
    };

    // Call onSubmit with newMedication
    onSubmit(newMedication);
  };

  const [scheduleMedication, setScheduleMedication] = useState<boolean | null>(
    null,
  );
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [times, setTimes] = useState<
    { hour: string; minute: string; period: "AM" | "PM" }[]
  >([{ hour: "", minute: "", period: "AM" }]);

  const toggleDaySelection = (day: string) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day],
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
          Medication Name <span style={{ color: "red" }}>*</span>
        </p>
        <input
          className={styles.input}
          type="text"
          placeholder="Medication Name"
          value={medicationData.medicationName}
          onChange={(e) => handleInputChange("medicationName", e.target.value)}
        />
        <p className={styles.textStructure}>Generic Name</p>
        <input
          className={styles.input}
          type="text"
          placeholder="Generic Name"
          value={medicationData.medicationGenericName}
          onChange={(e) =>
            handleInputChange("medicationGenericName", e.target.value)
          }
        />
        <p className={styles.textStructure}>
          Dosage <span style={{ color: "red" }}>*</span>
        </p>
        <div className={styles.dosageInputContainer}>
          <input
            className={styles.input}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            value={medicationData.medicationStrength === null ? '' : medicationData.medicationStrength}
            onChange={(e) => {
              const value = e.target.value;
              
              if (/^\d*$/.test(value)) {
                const sanitized = value.replace(/^0+(?=\d)/, '');
                handleInputChange(
                  "medicationStrength",
                  sanitized === '' ? 0 : Number(sanitized)
                );
              }
            }}
          />

          <div className={styles.unitRow}>
            {medicationData.selectedUnit === "Custom" && (
              <input
                type="text"
                placeholder="unit"
                className={`${styles.input} ${medicationData.selectedUnit === "Custom" ? styles.active : ""}`}
                value={medicationData.customUnit}
                onChange={(e) =>
                  handleInputChange("customUnit", e.target.value)
                }
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
            {medicationData.selectedDosageType === "custom" && (
              <input
                type="text"
                placeholder="Medication Medium"
                className={`${styles.input} ${medicationData.selectedDosageType === "custom" ? styles.active : ""}`}
                value={medicationData.customMedium}
                onChange={(e) =>
                  handleInputChange("customMedium", e.target.value)
                }
              />
            )}
            <div className={styles.unitOptions}>
              {["custom", "tablet", "injection"].map((medium) => (
                <button
                  key={medium}
                  className={`${styles.unitButton} ${medicationData.selectedDosageType === medium ? styles.selected : ""}`}
                  onClick={() =>
                    handleInputChange("selectedDosageType", medium)
                  }
                >
                  {medium.charAt(0).toUpperCase() + medium.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {medicationData.selectedDosageType !== "custom" && (
            <div>
              <p className={styles.textStructure}>Icon</p>
              <MedicationIconPicker
                medium={medicationData.selectedDosageType}
                selectedIcon={medicationData.icon}
                onSelect={(newIcon: string) => {
                  handleInputChange("icon", newIcon);
                }}
              />
            </div>
          )}
        </div>
        <div>
          <p className={styles.textStructure}>
            Quantity: <span style={{ color: "red" }}>*</span>
          </p>
          <div className={styles.quantityBox}>
            <input
              className={styles.input}
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              value={medicationData.medicationSupply === null ? '' : medicationData.medicationSupply}
              onChange={(e) => {
                const value = e.target.value;
                
                if (/^\d*$/.test(value)) {
                  const sanitized = value.replace(/^0+(?=\d)/, '');
                  handleInputChange(
                    "medicationSupply",
                    sanitized === '' ? 0 : Number(sanitized)
                  );
                }
              }}
            />
            <span>
              {medicationData.selectedUnit === "Custom"
                ? medicationData.customUnit
                : medicationData.selectedUnit}
            </span>
          </div>
        </div>
        {platform() !== "linux" && (
          // There's an issue on Linux where opening the date picker freezes
          // the entire app. Unless we design a custom one ourselves, the
          // Expiration Date feature will not be available on Linux.
          <>
            <p className={styles.textStructure}>Expiration Date</p>
            <input
              className={styles.input}
              type="date"
              placeholder="Expiration Date in MM/DD/YYYY"
              value={medicationData.medicationExpirationDate} // should never be undefined
              onChange={(e) =>
                handleInputChange("medicationExpirationDate", e.target.value)
              }
            />
          </>
        )}
        {/*
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
                */}
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
