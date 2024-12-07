// confirmMessage.tsx
// Ojos Project
import React from "react";
import "./Dialog.css";
import Button from "./Button";

interface DialogProps {
  title: string;
  content: string;
  children: React.ReactNode;
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
        <div className="dialog-actions">{children}</div>
      </div>
    </div>
  );
};

export default Dialog;
