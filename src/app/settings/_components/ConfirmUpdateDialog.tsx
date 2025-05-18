"use client";

import Dialog from "@/components/Dialog";
import Button from "./Button";
import { invoke } from "@tauri-apps/api/core";
import { useState } from "react";

type ConfirmUpdateDialogProps = {
  closeModel: Function;
  onRequest: Function;
};

const ConfirmUpdateDialog = ({
  closeModel,
  onRequest,
}: ConfirmUpdateDialogProps) => {
  const [step, setStep] = useState(0); // 0 = initial, 1 = confirm clear
  const [title, setTitle] = useState("Check for updates?");
  const [content, setContent] = useState(
    "Do you want to check for updates? This will check, download and install an update.",
  );
  const [buttonType, setButtonType] = useState<"PRIMARY" | "DANGER-PRIMARY">(
    "PRIMARY",
  );

  const handleContinue = () => {
    if (step === 0) {
      // Move to confirmation step
      setTitle("Delete all data?");
      setContent(
        "This will delete all your data. This action cannot be undone. Are you sure you want to update?",
      );
      setButtonType("DANGER-PRIMARY");
      setStep(1);
    } else {
      setTitle("Checking for update...");
      setContent("If an update is available, the app will restart.");
      setButtonType("PRIMARY");
      invoke<null>("check_update").then(() => {
        onRequest();
        closeModel();
      });
    }
  };

  const handleCancel = () => {
    setStep(0);
    closeModel();
  };

  return (
    <Dialog title={title} content={content}>
      {title === "Updating..." ? (
        <></>
      ) : (
        <div className="dialog-actions">
          <Button type="SECONDARY" label="Cancel" onClick={handleCancel} />
          <Button type={buttonType} label="Continue" onClick={handleContinue} />
        </div>
      )}
    </Dialog>
  );
};

export default ConfirmUpdateDialog;
