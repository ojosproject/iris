import React, { useState } from 'react';
import { MedicationLog } from "@/types";
import "./NewMed.css";

interface MedicationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (newMedication: MedicationLog) => void;
}

const MedicationModal: React.FC<MedicationModalProps> = ({ isOpen, onClose, onSubmit }) => {
    const [medicationName, setMedicationName] = useState('');
    const [givenDose, setGivenDose] = useState(0);
    const [measurement, setMeasurement] = useState('mg');
    // Set timestamp to 0 by default
    //const [timestamp, setTimestamp] = useState(Date.now());

    const handleSubmit = () => {
        if (!medicationName) {
            alert('Medication name cannot be empty!');
            return;
        }
        onSubmit({
            medication_name: medicationName,
            given_dose: givenDose,
            measurement,
            timestamp: 0,
        });

        setMedicationName('');
        setGivenDose(0);
        setMeasurement('mg');
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="modal">
            <div className="modal-content">
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
                    Given Dose:
                    <input
                        type="number"
                        value={givenDose}
                        onChange={(e) => setGivenDose(Number(e.target.value))}
                    />
                </label>
                <label>
                    Measurement:
                    <input
                        type="text"
                        value={measurement}
                        onChange={(e) => setMeasurement(e.target.value)}
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
                <button className="submit-button" onClick={handleSubmit}>Submit</button>
                <button className="cancel-button" onClick={onClose}>Cancel</button>
            </div>
        </div>
    );
};

export default MedicationModal;