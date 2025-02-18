// ScheduleMedicationModal for the scheduling medication
import React from "react";
import styles from "./ScheduleRequest.module.css";
import { use, useState } from "react";
import { Medication } from "../types";

interface NextScheduleForm {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (newMedication: Medication) => void;
}

interface NextScheduleForm {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (newMedication: Medication) => void;
}

const ScheduleForm: React.FC<NextScheduleForm> = ({
    isOpen,
    onClose,
    onSubmit,
}) => {
    const [scheduleMedication, setScheduleMedication] = useState<boolean | null>(
        null,
    );
    const [selectedDays, setSelectedDays] = useState<string[]>([]);
    const [times, setTimes] = useState<{ hour: string; minute: string; period: "AM" | "PM" }[]>([
        { hour: "", minute: "", period: "AM" },  // Initialize with one time slot
    ]);
    const [medicationStartDate, setMedicationStartDate] = useState<
        string | undefined
    >(undefined);
    const [medicationEndDate, setMedicationEndDate] = useState<
        string | undefined
    >(undefined);

    const toggleDaySelection = (day: string) => {
        setSelectedDays((prev) =>
            prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day],
        );
    };

    const addTimeSlot = () => {
        setTimes([...times, { hour: "", minute: "", period: "AM" }]);
        console.log("Updated times:", times); // Check if times state is updated
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

    const handleSubmit = () => {
        if (scheduleMedication === false) {
            onClose();
            return;
        }

        const newMedication: Medication = {
            start_date: medicationStartDate
                ? Date.parse(medicationStartDate)
                : undefined,
            end_date: medicationEndDate ? Date.parse(medicationEndDate) : undefined,
            frequency: selectedDays.join(", "),
            id: "",
            name: "",
            dosage_type: "",
            strength: 0,
            units: "",
            quantity: 0,
            created_at: 0,
            updated_at: 0,
        };
        onSubmit(newMedication);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className={styles.modal}>
            <div className={styles.modalContent}>
                <h2>Schedule Medication</h2>

                {/* Yes/No Prompt */}
                <p>Would you like to add scheduling for this medicine?</p>
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

                {/* Days Selection */}
                <div
                    className={`${styles.scheduleDetails} ${scheduleMedication ? "" : styles.disabled
                        }`}
                >
                    <p>Select Days:</p>
                    <div className={styles.daySelection}>
                        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                            <button
                                key={day}
                                className={`${selectedDays.includes(day) ? styles.selected : ""} ${!scheduleMedication ? styles.disabledButton : ""
                                    }`}
                                onClick={() => {
                                    if (scheduleMedication) toggleDaySelection(day);
                                }}
                                disabled={!scheduleMedication}
                            >
                                {day}
                            </button>
                        ))}
                    </div>

                    {/* Time Selection */}
                    <p>Select Time:</p>
                    {times.map((time, index) => (
                        <div
                            key={index}
                            className={`${styles.timeSelection} ${!scheduleMedication ? styles.disabled : ""
                                }`}
                        >
                            <input
                                type="number"
                                min="1"
                                max="12"
                                placeholder="HH"
                                value={time.hour}
                                onChange={(e) => {
                                    if (scheduleMedication)
                                        updateTimeSlot(index, "hour", e.target.value);
                                }}
                                disabled={!scheduleMedication}
                            />
                            <input
                                type="number"
                                min="0"
                                max="59"
                                placeholder="MM"
                                value={time.minute}
                                onChange={(e) => {
                                    if (scheduleMedication)
                                        updateTimeSlot(index, "minute", e.target.value);
                                }}
                                disabled={!scheduleMedication}
                            />
                            <select
                                value={time.period}
                                onChange={(e) => {
                                    if (scheduleMedication)
                                        updateTimeSlot(index, "period", e.target.value);
                                }}
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
                        onMouseDown={() => console.log("Mouse down on Add Another Time!")}
                        disabled={!scheduleMedication}
                    >
                        + Add Another Time
                    </button>
                </div>

                {/* Modal Action Buttons */}
                <div className={styles.modalActions}>
                    <button onClick={onClose}>Previous</button>
                    <button onClick={handleSubmit}>Add Medication</button>
                </div>
            </div>
        </div>
    );
};

export default ScheduleForm;
