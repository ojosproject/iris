/**
 * File:     settings/device/page.tsx
 * Purpose:  Handles device/provider related settings.
 * Authors:  Ojos Project & Iris contributors
 * License:  GNU General Public License v3.0
 */
"use client";
import { useEffect, useState } from "react";
import SettingSection from "../_components/SettingsSection";
import Toggle from "react-toggle";
import "react-toggle/style.css";
import useKeyPress from "@/components/useKeyPress";
import { useRouter } from "next/navigation";
import { disable, enable, isEnabled } from "@tauri-apps/plugin-autostart";
import { getCurrentWindow } from "@tauri-apps/api/window";
import styles from "../page.module.css";
import { Config } from "@/types/settings";
import { invoke } from "@tauri-apps/api/core";

export default function Page() {
  const [kioskEnabled, setKioskEnabled] = useState(false);
  const [config, setConfig] = useState<Config | null>(null);
  const router = useRouter();

  useKeyPress("Escape", () => {
    router.push("/");
  });

  useEffect(() => {
    async function getAutostartInfo() {
      setKioskEnabled(await isEnabled());
    }

    async function initConfig() {
      setConfig(await invoke<Config>("get_config"));
    }

    getAutostartInfo();
    initConfig();
  }, []);

  return (
    <section className={styles.sectionContainer}>
      <SettingSection
        label="Provider information"
        description="This software is provided to you by Ojos Project."
      >
        <img src="https://ojosproject.org/images/header.png" />
      </SettingSection>
      <SettingSection
        label="Appearance"
        description="Change the appearance of the system."
      >
        <div className={styles.appearanceToggleContainer}>
          <p>Light</p>
          <Toggle
            icons={false}
            checked={config ? config.appearance === "dark" : false}
            className="toggle"
            onChange={(e) => {
              const newConfig = {
                onboarding_completed: config?.onboarding_completed,
                appearance: e.target.checked ? "dark" : "light",
              } as Config;

              const window = getCurrentWindow();
              window.setTheme(newConfig.appearance);

              setConfig(newConfig);
              invoke("set_config", { config: newConfig });
            }}
          />
          <p>Dark</p>
        </div>
      </SettingSection>
      <SettingSection
        label="Kiosk mode"
        description="Enabling Kiosk mode will start Iris in fullscreen on system startup."
      >
        <Toggle
          icons={false}
          checked={kioskEnabled}
          className="toggle"
          onChange={async (e) => {
            setKioskEnabled(e.target.checked);
            const window = getCurrentWindow();

            if (e.target.checked) {
              await enable();
              await window.setFullscreen(true);
            } else {
              await disable();
              await window.setFullscreen(false);
            }
          }}
        />
      </SettingSection>
    </section>
  );
}
