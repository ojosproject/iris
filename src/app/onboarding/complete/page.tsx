"use client";
import classes from "../Onboarding.module.css";
import Button from "../../components/Button";
import { useRouter } from "next/navigation";
import BackButton from "../../components/BackButton";
import { invoke } from "@tauri-apps/api/core";

export default function OnboardingComplete() {
  const router = useRouter();
  return (
    <div className={classes.onboarding_center}>
      <BackButton
        onClick={() => {
          router.back();
        }}
        style={{ position: "fixed", top: 2, left: 2 }}
      />
      <h3>Onboarding completed!</h3>
      <div className={classes.button_on_bottom}>
        <Button
          type="PRIMARY"
          label="Finish"
          onClick={() => {
            invoke("complete_onboarding")
              .then(() => {
                router.push("/");
              })
              .catch((err) => {
                console.log(err);
              });
          }}
        />
      </div>
    </div>
  );
}
