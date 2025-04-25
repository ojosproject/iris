"use client";

import Dialog from "@/app/components/Dialog";
import Button from "../components/Button";
import classes from "./page.module.css";
import { invoke } from "@tauri-apps/api/core";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

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
      console.log("Update in Progress.");

      //TODO delete data dir
      //TODO invoke update
      //   invoke("check_update").then((i) => {
      //     console.log(i);
      //   });
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
