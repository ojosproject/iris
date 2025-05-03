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
      // Confirmation Action
      invoke("check_update")
        .then(() => {
          setTitle("Update Available!");
          setContent(
            "Would you like to update? This will clear all your data and restart the app. Are you sure you want to proceed?",
          );
          setStep(1); // Proceed to update
        })
        .catch((error) => {
          //TODO replace with handle cancel
          setStep(0);
          router.back();

          if (error === "There are no updates to install!") {
            // No updates available
            <ToastDialog title="Sorry!" content={error}>
              <></>
            </ToastDialog>;
          } else {
            // Error while checking for updates
            console.log("no updates");
            <ToastDialog title="Sorry!" content={error}>
              <></>
            </ToastDialog>;
          }
        });
    } else {
      // Final step: perform the update

      invoke("install_update")
        .then((_) => {
          setStep(0);
          router.back();

          <ToastDialog title="Update Successfully Installed!" content={"Yay!"}>
            <></>
          </ToastDialog>;

          setTimeout(() => {
            console.log("Restarting Now");
            invoke("restart_app");
          }, 5000);
        })
        .catch((error) => {
          // Various error checks
          switch (true) {
            case error === "There's no update to install": // no update
              setStep(0);
              router.back();

              <ToastDialog title="Sorry!" content={error}>
                <></>
              </ToastDialog>;

              break;

            case error.startsWith("Failed to check for updates"): // update checker failed
              setStep(0);
              router.back();

              <ToastDialog title="Sorry!" content={error}>
                <></>
              </ToastDialog>;
              break;

            case error.startsWith("Failed to install update"): // update installer failed
              setStep(0);
              router.back();

              <ToastDialog title="Sorry!" content={error}>
                <></>
              </ToastDialog>;
              break;

            case error === "App Data Dir does not exist.":
              setStep(0);
              router.back();

              <ToastDialog title="Sorry!" content={error}>
                <></>
              </ToastDialog>;
              break;

            default: // unknown errors
              setStep(0);
              router.back();

              <ToastDialog title="Sorry!" content={error}>
                <></>
              </ToastDialog>;
              break;
          }
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
