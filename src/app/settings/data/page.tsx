/**
 * File:     settings/data/page.tsx
 * Purpose:  Handles user data settings.
 * Authors:  Ojos Project & Iris contributors
 * License:  GNU General Public License v3.0
 */
"use client";
import useKeyPress from "@/components/useKeyPress";
import SettingSection from "../_components/SettingsSection";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Dialog from "@/components/Dialog";
import { remove, BaseDirectory } from "@tauri-apps/plugin-fs";
import { relaunch } from "@tauri-apps/plugin-process";
import { invoke } from "@tauri-apps/api/core";
import { DataPackReceipt } from "@/types/settings";
import styles from "../page.module.css";

export default function Page() {
  const [dialogReset, setDialogReset] = useState(false);
  const [dialogDataPacks, setDialogDataPacks] = useState(false);
  const [dpTitle, setDpTitle] = useState("");
  const [dpContent, setDpContent] = useState("");
  const [disableDpButton, setDisableDpButton] = useState(false);
  const router = useRouter();

  useKeyPress("Escape", () => {
    if (dialogReset) {
      setDialogReset(false);
    } else if (dialogDataPacks) {
      setDialogDataPacks(false);
    } else {
      router.push("/");
    }
  });

  return (
    <>
      {dialogDataPacks && (
        <Dialog title={dpTitle} content={dpContent}>
          <button className="primary" onClick={() => setDialogDataPacks(false)}>
            Continue
          </button>
        </Dialog>
      )}
      {dialogReset && (
        <Dialog
          title="Reset software?"
          content="You are about to delete all Iris data. This action is irreversible. Are you sure?"
        >
          <>
            <button className="secondary" onClick={() => setDialogReset(false)}>
              Cancel
            </button>
            <button
              className="dangerPrimary"
              onClick={async () => {
                await remove("user/", {
                  baseDir: BaseDirectory.AppData,
                  recursive: true,
                });
                setDialogReset(false);
                await relaunch();
              }}
            >
              Yes
            </button>
          </>
        </Dialog>
      )}
      <section className={styles.sectionContainer}>
        <SettingSection
          label="Data Packs"
          description="A Data Pack is a JSON file you can import to quickly add resources at once without needing to add everything manually."
        >
          <button
            className="secondary"
            disabled={disableDpButton}
            onClick={() => {
              setDisableDpButton(true);
              invoke<DataPackReceipt>("import_data_pack")
                .then((receipt) => {
                  let title = "Sorry, something went wrong.";
                  let message =
                    "No data was imported. Make sure the data isn't already in the database. Consult the docs for more information.";

                  if (
                    receipt.pro_count ||
                    receipt.resources_count ||
                    receipt.contacts_count
                  ) {
                    title = "Data Pack was successfully imported!";
                    message = "";
                  }

                  if (receipt.pro_count) {
                    message += `${receipt.pro_count} PRO question${receipt.pro_count > 1 ? "s" : ""} imported.\n`;
                  }
                  if (receipt.resources_count) {
                    message += `${receipt.resources_count} resource${receipt.resources_count > 1 ? "s" : ""} imported.\n`;
                  }

                  if (receipt.contacts_count) {
                    message += `${receipt.contacts_count} contact${receipt.contacts_count > 1 ? "s" : ""} imported.\n`;
                  }

                  setDpTitle(title);
                  setDpContent(message);
                  setDialogDataPacks(true);
                })
                .catch((e) => {
                  setDpTitle("Sorry, something went wrong.");
                  setDpContent(e);
                  setDialogDataPacks(true);
                })
                .finally(() => {
                  setDisableDpButton(false);
                });
            }}
          >
            Select a file...
          </button>
        </SettingSection>
        <SettingSection
          label="Delete all data"
          description="Delete all your data and reset the software. This is irreversible, so be careful!"
        >
          <button
            className="dangerPrimary"
            onClick={() => setDialogReset(true)}
          >
            Reset software
          </button>
        </SettingSection>
      </section>
    </>
  );
}
