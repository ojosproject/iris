"use client";
import classes from "./page.module.css";
import HubHeader from "./hub/HubHeader";
import HubTool, { HubToolProps } from "./hub/HubTool";
import { HubTools } from "./hub/HubTools";
import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { Config } from "@/app/settings/types";
import Onboarding from "./onboarding/Onboarding";
import { platform } from "@tauri-apps/plugin-os";

export default function Home() {
  const [onboardingCompleted, setOnboardingCompleted] = useState(false);
  const [availableTools, setAvailableTools] =
    useState<HubToolProps[]>(HubTools);

  useEffect(() => {
    invoke<Config>("get_config").then((c) => {
      setOnboardingCompleted(c.onboarding_completed);
    });

    const PLATFORM = platform();

    if (!["windows", "macos"].includes(PLATFORM)) {
      setAvailableTools(HubTools.filter((hubTool) => hubTool.name !== "Video"));
    }
  }, []);

  function handleCompletedOnboarding() {
    setOnboardingCompleted(true);
    invoke("complete_onboarding");
  }

  return onboardingCompleted ? (
    <>
      <HubHeader></HubHeader>
      <main className={classes.flex}>
        <section className={classes.side1}>
          <h2> Your Tools </h2>
          <ul className={classes.appList}>
            {availableTools.map((hubTool) => (
              <HubTool
                key={hubTool.name}
                link={hubTool.link}
                icon={hubTool.icon}
                name={hubTool.name}
              />
            ))}
          </ul>
        </section>
      </main>
    </>
  ) : (
    <Onboarding handleCompletedOnboarding={handleCompletedOnboarding} />
  );
}
