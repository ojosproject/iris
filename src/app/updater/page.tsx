"use client";

import Dialog from "@/app/components/Dialog";
import ToastDialog from "../components/ToastDialog";
import Button from "../components/Button";
import { invoke } from "@tauri-apps/api/core";
import { useState } from "react";
import { useRouter } from "next/navigation";

const ConfirmUpdateDialog = () => {
  const [step, setStep] = useState(0); // 0 = initial, 1 = confirm clear
  const [title, setTitle] = useState("Update App");
  const [content, setContent] = useState("Do you want to update the app?");
  const router = useRouter();

  const handleContinue = () => {
    if (step === 0) {
      // Move to confirmation step
      setTitle("Clear Data");
      setContent(
        "This will clear all your data. Are you sure you want to proceed?",
      );
      setStep(1);
    } else {
      // Final step: perform the action

      invoke("delete_iris_data")
        .then((i) => {
          console.log(`After deleting data: ${i}`);
        })
        .catch((error) => {
          setStep(0);
          router.back();

          <ToastDialog title="Sorry!" content={error}>
            <></>
          </ToastDialog>;
        });
    }
  };

  const handleCancel = () => {
    // Close Dialog

    setStep(0);
    router.back();
  };

  return (
    <div>
      <Dialog title={title} content={content}>
        <div className="dialog-actions">
          <Button type="SECONDARY" label="Cancel" onClick={handleCancel} />
          <Button type="PRIMARY" label="Continue" onClick={handleContinue} />
        </div>
      </Dialog>
    </div>
  );
};

export default ConfirmUpdateDialog;
