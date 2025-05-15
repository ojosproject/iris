/**
 * File:     page.tsx (Root)
 * Purpose:  Iris Hub. Displays a list of available tools.
 * Authors:  Ojos Project & Iris contributors
 * License:  GNU General Public License v3.0
 */
"use client";
import styles from "./page.module.css";
import HubHeader from "./hub/HubHeader";
import HubTool, { HubToolProps } from "./hub/HubTool";
import { HubTools } from "./hub/HubTools";
import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { Config } from "@/app/settings/types";
import { platform } from "@tauri-apps/plugin-os";
import { useRouter } from "next/navigation";

export default function Hub() {
  const [onboardingCompleted, setOnboardingCompleted] = useState(false);
  const [availableTools, setAvailableTools] =
    useState<HubToolProps[]>(HubTools);
  const router = useRouter();

  useEffect(() => {
    invoke<Config>("get_config").then((c) => {
      setOnboardingCompleted(c.onboarding_completed);

      if (!c.onboarding_completed) {
        router.push("/onboarding");
      }
    });

    if (!["windows", "macos"].includes(platform())) {
      setAvailableTools(HubTools.filter((hubTool) => hubTool.name !== "Video"));
    }
  }, []);

  return (
    onboardingCompleted && (
      <>
        <HubHeader></HubHeader>
        <section className={styles.sectionTools}>
          <h2> Your Tools </h2>
          <ul className={styles.toolList}>
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
      </>
    )
  );
}
