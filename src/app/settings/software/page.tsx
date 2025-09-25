/**
 * File:     settings/software/page.tsx
 * Purpose:  Handles software updates and version numbers.
 * Authors:  Ojos Project & Iris contributors
 * License:  GNU General Public License v3.0
 */
"use client";
import Dialog from "@/components/Dialog";
import SettingSection from "../_components/SettingsSection";
import styles from "../page.module.css";
import { getVersion, getTauriVersion } from "@tauri-apps/api/app";
import {
  platform as getPlatform,
  version as getOsVersion,
} from "@tauri-apps/plugin-os";
import { relaunch } from "@tauri-apps/plugin-process";
import { check } from "@tauri-apps/plugin-updater";
import { useEffect, useState } from "react";
import useKeyPress from "@/components/useKeyPress";
import { useRouter } from "next/navigation";

export default function Page() {
  const [appVersion, setAppVersion] = useState("0");
  const [tauriVersion, setTauriVersion] = useState("0");
  const [platform, setPlatform] = useState("OS");
  const [osVersion, setOsVersion] = useState("0");
  const router = useRouter();

  // updater stuff
  const [status, setStatus] = useState("");
  const [description, setDescription] = useState("");
  const [dialog, setDialog] = useState(false);

  async function checkUpdate() {
    setStatus("Checking for updates...");
    setDescription("Please wait while we connect to GitHub.");
    check({ timeout: 3000 })
      .then((update) => {
        if (update) {
          let downloaded: number = 0;
          let contentLength: number = 0;

          update
            .downloadAndInstall((event) => {
              switch (event.event) {
                case "Started":
                  setStatus("Downloading update...");
                  contentLength = event.data.contentLength!;
                  setDescription(`Downloading v${update.version}...`);
                  break;
                case "Progress":
                  downloaded += event.data.chunkLength;
                  break;
                case "Finished":
                  break;
              }
            })
            .then(() => {
              setStatus("Restarting...");
              setDescription(
                "The update was successfully installed. The app will now restart.",
              );
              relaunch().then();
            })
            .catch((e) => {
              throw e;
            });
        } else {
          setStatus("You're up to date!");
          setDescription("You're using the most up to date version.");
        }
      })
      .catch((e) => {
        if (e.includes("error sending request")) {
          setStatus("Something went wrong.");
          setDescription(
            "Could not connect to GitHub. Is your device connected to the internet?",
          );
        } else {
          setStatus("Something went wrong.");
          setDescription("Please try again later.");
        }

        throw e;
      });
  }

  useEffect(() => {
    const getVersionInfo = async () => {
      setAppVersion(await getVersion());
      setTauriVersion(await getTauriVersion());
      setOsVersion(getOsVersion());

      switch (getPlatform()) {
        case "windows":
          setPlatform("Windows");
          break;
        case "macos":
          setPlatform("macOS");
          break;
      }
    };
    getVersionInfo();
  }, []);

  useKeyPress("Escape", () => {
    if (dialog) {
      setDialog(false);
    } else {
      router.push("/");
    }
  });

  return (
    <>
      {dialog && (
        <Dialog title={status} content={description}>
          {["Something went wrong", "You're up to date!"].includes(status) && (
            <>
              <button className="secondary" onClick={() => setDialog(false)}>
                Okay
              </button>
            </>
          )}
        </Dialog>
      )}
      <section>
        <SettingSection
          label="Software updates"
          description="Software updates keep your system up to date with new features and security improvements."
        >
          <button
            className="secondary"
            style={{ width: "100%" }}
            onClick={() => {
              setDialog(true);
              checkUpdate().then();
            }}
          >
            Check for updates
          </button>
        </SettingSection>
        <SettingSection
          label="App version"
          description="This is the version of Iris released by Ojos Project."
        >
          <span className={styles.bigVersion}>v{appVersion}</span>
        </SettingSection>
        <SettingSection
          label="Tauri version"
          description="Tauri is the toolkit used to build Iris."
        >
          <span className={styles.bigVersion}>v{tauriVersion}</span>
        </SettingSection>
        <SettingSection
          label={`${platform} version`}
          description="This is the version number of your device."
        >
          <span className={styles.bigVersion}>v{osVersion}</span>
        </SettingSection>
      </section>
    </>
  );
}
