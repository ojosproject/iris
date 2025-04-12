// confirmMessage.tsx
// Ojos Project
import React from "react";
import "./Dialog.css";
import Button from "./Button";

interface DialogProps {
  title: string;
  content: string;
  children: React.ReactNode;
  fadeOut?: number;
}

const Dialog: React.FC<DialogProps> = ({ title, content, children }) => {
  return (
    <div className="dialog-overlay">
      <div className="dialog-popup">
        <div className="dialog-header">
          <h3>{title}</h3>
        </div>
        <div className="dialog-content">
          <p>{content}</p>
        </div>
        {children}
      </div>
    </div>
  );
};

export default Dialog;
