import React, { useState } from "react";
import styles from "./schedule.module.css";
import { Medication } from "../../types";

const ScheduleForm: React.FC = ({ }) => {
    const [scheduleMedication, setScheduleMedication] = useState<boolean | null>(null);
    const [selectedDays, setSelectedDays] = useState<string[]>([]);
    const [times, setTimes] = useState<{ hour: string; minute: string; period: "AM" | "PM" }[]>([
        { hour: "", minute: "", period: "AM" },
    ]);
    const [medicationStartDate, setMedicationStartDate] = useState<string | undefined>(undefined);
    const [medicationEndDate, setMedicationEndDate] = useState<string | undefined>(undefined);

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

    const handleSubmit = () => {
        const newMedication: Medication = {
            start_date: medicationStartDate ? Date.parse(medicationStartDate) : undefined,
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
        console.log("Scheduled Medication:", newMedication);
    };

    return (
        <div className={styles.pageContainer}>
            <div className={styles.pageContent}>
                <h2 className={styles.textStructure}>Add New Medication</h2>
                {/* Yes/No Prompt */}
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

                {/* Days Selection */}
                <p className={styles.textStructure}>Select Days:</p>
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

                    {/* Time Selection */}
                    <p className={styles.textStructure}>Select Time:</p>
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

                {/* Submit */}
                <div className={styles.modalActions}>
                    <button onClick={handleSubmit}>Add Medication</button>
                </div>
            </div>
        </div>
    );
};

export default ScheduleForm;
