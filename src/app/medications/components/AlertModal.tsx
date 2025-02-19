import React from "react";
import { use, useState } from "react";
import styles from "./AlertModal.module.css";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    message: string;
}

const AlertModal: React.FC<ModalProps> = ({ isOpen, onClose, message }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>{message}</h2>
                <button onClick={onClose}>Close</button>
            </div>
        </div>
    );
};

export default AlertModal;