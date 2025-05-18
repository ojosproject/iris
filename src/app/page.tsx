/**
 * File:     page.tsx (Root)
 * Purpose:  Iris Hub. Displays a list of available tools.
 * Authors:  Ojos Project & Iris contributors
 * License:  GNU General Public License v3.0
 */
"use client";
import styles from "./page.module.css";
import HubHeader from "@/components/HubHeader";
import HubToolButton from "@/components/HubToolButton";
import { HubTool } from "../types/hub";
import { hubTools } from "@/utils/hub";
import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { Config } from "@/types/settings";
import { platform } from "@tauri-apps/plugin-os";
import { useRouter } from "next/navigation";

export default function Hub() {
  const [onboardingCompleted, setOnboardingCompleted] = useState(false);
  const [availableTools, setAvailableTools] = useState<HubTool[]>(hubTools);
  const router = useRouter();

  useEffect(() => {
    invoke<Config>("get_config").then((c) => {
      setOnboardingCompleted(c.onboarding_completed);

      if (!c.onboarding_completed) {
        router.push("/onboarding");
      }
    });

    if (!["windows", "macos"].includes(platform())) {
      setAvailableTools(hubTools.filter((hubTool) => hubTool.name !== "Video"));
    }
  }, []);

  return (
    onboardingCompleted && (
      <main>
        <HubHeader></HubHeader>
        <section className={styles.sectionTools}>
          <h2> Your Tools </h2>
          <ul className={styles.toolList}>
            {availableTools.map((hubTool) => (
              <HubToolButton
                key={hubTool.name}
                link={hubTool.link}
                icon={hubTool.icon}
                name={hubTool.name}
              />
            ))}
          </ul>
        </section>
      </main>
    )
  );
}
