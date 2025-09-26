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

export default function Page() {
  const [kioskEnabled, setKioskEnabled] = useState(false);
  const router = useRouter();

  useKeyPress("Escape", () => {
    router.push("/");
  });

  useEffect(() => {
    async function getAutostartInfo() {
      setKioskEnabled(await isEnabled());
    }

    getAutostartInfo();
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
        label="Kiosk mode"
        description="Enabling Kiosk mode will start Iris in fullscreen on system startup."
      >
        <Toggle
          icons={false}
          checked={kioskEnabled}
          className="toggle"
          onChange={(e) => {
            setKioskEnabled(e.target.checked);

            if (e.target.checked) {
              enable()
                .then(() => {
                  const window = getCurrentWindow();
                  window.setFullscreen(true).then();
                })
                .catch((e) => console.error(e));
            } else {
              disable()
                .then()
                .catch((e) => console.error(e));
            }
          }}
        />
      </SettingSection>
    </section>
  );
}
