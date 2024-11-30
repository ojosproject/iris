import React from "react";
import "./confirmMessage.css";

interface DialogProps {
  title: string;
  content: string;
  onClose: () => void;
  onConfirm: () => void; // Adding a confirm action
}

const Dialog: React.FC<DialogProps> = ({
  title,
  content,
  onClose,
  onConfirm,
}) => {
  return (
    <div className="dialog-overlay">
      <div className="dialog-popup">
        <div className="dialog-header">
          <h3>{title}</h3>
          <button className="close-button" onClick={onClose}>
            X
          </button>
        </div>
        <div className="dialog-content">
          <p>{content}</p>
        </div>
        <div className="dialog-actions">
          <button className="confirm-button" onClick={onConfirm}>
            Yes, I am sure
          </button>
          <button className="cancel-button" onClick={onClose}>
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dialog;
