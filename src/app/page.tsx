"use client";
import classes from "./page.module.css";
import HubHeader from "./core/hub/HubHeader";
import HubApp from "./core/hub/HubApp";
import { HubApps } from "./core/HubApps";
import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { Config } from "@/app/core/types";
import Onboarding from "./core/Onboarding";
import JoystickWrapper from "./core/components/JoystickWrapper";
import { useRouter } from "next/navigation";

export default function Home() {
  const [onboardingCompleted, setOnboardingCompleted] = useState(false);
  const [joystickActiveId, setJoystickActiveId] = useState(HubApps[0].link);
  const router = useRouter();

  useEffect(() => {
    invoke("get_config").then((c) => {
      setOnboardingCompleted((c as Config).onboarding_completed);
    });
    invoke("joystick_events");
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
          <h2> Your Apps </h2>
          <ul className={classes.appList}>
            {HubApps.map((hubApp, index) => (
              <JoystickWrapper
                key={hubApp.link}
                id={hubApp.link}
                activeId={joystickActiveId}
                setActiveId={setJoystickActiveId}
                leftId={index !== 0 ? HubApps[index - 1].link : undefined}
                rightId={
                  HubApps.length !== index + 1
                    ? HubApps[index + 1].link
                    : undefined
                }
                onSelect={() => {
                  router.push(hubApp.link);
                }}
              >
                <HubApp
                  key={hubApp.name}
                  link={hubApp.link}
                  icon={hubApp.icon}
                  name={hubApp.name}
                />
              </JoystickWrapper>
            ))}
          </ul>
        </section>
      </main>
    </>
  ) : (
    <Onboarding handleCompletedOnboarding={handleCompletedOnboarding} />
  );
}
