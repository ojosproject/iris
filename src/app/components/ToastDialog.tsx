// ToastDialog.tsx
// Ojos Project
import React from "react";
import "./ToastDialog.css";

import Dialog from "./Dialog";
import Button from "./Button";

interface ToastDialogProps {
  title: string;
  content: string;
  children: React.ReactNode;
}

const ToastDialog: React.FC<ToastDialogProps> = ({
  title,
  content,
  children,
}) => {
  return (
    <Dialog title={title} content={content}>
      {children}
    </Dialog>
  );
};

export default ToastDialog;
