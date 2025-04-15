"use client";
import classes from "./page.module.css";
import HubHeader from "./hub/HubHeader";
import HubTool from "./hub/HubTool";
import { HubTools } from "./hub/HubTools";
import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { Config } from "@/app/settings/types";
import Onboarding from "./onboarding/Onboarding";

export default function Home() {
  const [onboardingCompleted, setOnboardingCompleted] = useState(false);

  useEffect(() => {
    invoke("get_config").then((c) => {
      setOnboardingCompleted((c as Config).onboarding_completed);
    });
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
            {HubTools.map((hubTool) => (
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
