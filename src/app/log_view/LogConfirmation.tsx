import React from "react";
import './LogConfirmation.css';

interface ConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    medicationName: {
        medName: string;
        medDosage: string;
        medFrequency: string;
    } | null;
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
                    <div className="logName">Name: {medicationName.medName}</div>
                    <div className="logDosage">Dosage: {medicationName.medDosage}</div>
                    <div className="logFrequency">Frequency: {medicationName.medFrequency}</div>
                </div>
                <div className="notificationSection">
                    <p>Push Notification to:</p>
                    <input type="text" placeholder="(###) ###-####" className="phoneNumberInput" />
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