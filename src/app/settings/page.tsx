/**
 * File:     settings/page.tsx
 * Purpose:  The page when users open the Settings icon.
 * Authors:  Ojos Project & Iris contributors
 * License:  GNU General Public License v3.0
 */
"use client";
import { ReactElement, useEffect, useState } from "react";
import styles from "./page.module.css";
import { Config, DataPackReceipt } from "@/types/settings";
import Dialog from "@/components/Dialog";
import { invoke } from "@tauri-apps/api/core";
import useKeyPress from "@/components/useKeyPress";
import { useRouter } from "next/navigation";
import Layout from "@/components/Layout";
import { check } from "@tauri-apps/plugin-updater";
import { relaunch } from "@tauri-apps/plugin-process";

type RowProps = {
  children: ReactElement;
  label: string;
};

function Row({ children, label }: RowProps) {
  return (
    <label title={label} className={styles.labelRow}>
      <p>{label}</p>
      {children}
    </label>
  );
}

type SectionProps = {
  children: ReactElement;
  title: string;
  description: string;
};

function Section({ children, title, description }: SectionProps) {
  return (
    <section className={styles.column}>
      <h2>{title}</h2>
      <p>{description}</p>
      {children}
    </section>
  );
}

type UpdaterStatus =
  | "Checking for updates..."
  | "Downloading update..."
  | "Restarting..."
  | "Something went wrong."
  | "You're up to date!";

export default function Settings() {
  const [config, setConfig] = useState<Config | null>(null);
  const [displayDialog, setDisplayDialog] = useState(false);
  const [displayNumberDialog, setDisplayNumberDialog] = useState(false);
  const [displayResetDialog, setDisplayResetDialog] = useState(false);
  const [dataPackDialog, setDataPackDialog] = useState({
    enabled: false,
    title: "",
    content: "",
  });
  const [displayUpdater, setDisplayUpdater] = useState(false);
  const [updateButtonLabel, setUpdateButtonLabel] = useState("Request");
  const [updateButtonDisabled, setUpdateButtonDisabled] = useState(false);
  const router = useRouter();
  const [updaterStatus, setUpdaterStatus] = useState<UpdaterStatus>(
    "Checking for updates...",
  );
  const [updaterDescription, setUpdaterDescription] = useState(
    "Please wait while we connect to GitHub.",
  );

  useEffect(() => {
    invoke<Config>("get_config").then((c) => {
      setConfig(c);
    });
  }, []);

  useKeyPress("Escape", () => {
    if (displayDialog) {
      setDisplayDialog(false);
    } else if (displayNumberDialog) {
      setDisplayNumberDialog(false);
    } else if (displayUpdater) {
      setDisplayUpdater(false);
    } else {
      router.back();
    }
  });

  function UpdaterSection() {
    function checkUpdate() {
      setUpdaterStatus("Checking for updates...");
      setUpdaterDescription("Please wait while we connect to GitHub.");
      check({ timeout: 3000 })
        .then((update) => {
          if (update) {
            let downloaded: number = 0;
            let contentLength: number = 0;

            update
              .downloadAndInstall((event) => {
                switch (event.event) {
                  case "Started":
                    setUpdaterStatus("Downloading update...");
                    contentLength = event.data.contentLength!;
                    setUpdaterDescription(`Downloading v${update.version}...`);
                    break;
                  case "Progress":
                    downloaded += event.data.chunkLength;
                    break;
                  case "Finished":
                    break;
                }
              })
              .then(() => {
                setUpdaterStatus("Restarting...");
                setUpdaterDescription(
                  "The update was successfully installed. The app will now restart.",
                );
                relaunch().then();
              })
              .catch((e) => {
                throw e;
              });
          } else {
            setUpdaterStatus("You're up to date!");
            setUpdaterDescription("You're using the most up to date version.");
          }
        })
        .catch((e) => {
          if (e.includes("error sending request")) {
            setUpdaterStatus("Something went wrong.");
            setUpdaterDescription(
              "Could not connect to GitHub. Is your device connected to the internet?",
            );
          } else {
            setUpdaterStatus("Something went wrong.");
            setUpdaterDescription("Please try again later.");
          }

          throw e;
        });
    }

    return (
      config && (
        <Section
          title="Updates"
          description="Request software updates and automatically install them."
        >
          <Row label="Request Updates">
            <button
              className="primary"
              disabled={updateButtonDisabled}
              onClick={() => {
                if (!updateButtonDisabled) {
                  setDisplayUpdater(true);
                  checkUpdate();
                }
              }}
            >
              {updateButtonLabel}
            </button>
          </Row>
        </Section>
      )
    );
  }
  function ImportSection() {
    return (
      config && (
        <Section
          title="Data Packs"
          description="Import data such as resources, survey questions, or contact information with JavaScript Object Notation."
        >
          <div>
            <Row label="Data Pack (JSON)">
              <button
                className="primary"
                onClick={() => {
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

                      setDataPackDialog({
                        enabled: true,
                        title: title,
                        content: message,
                      });
                    })
                    .catch((e) => {
                      setDataPackDialog({
                        enabled: true,
                        title: "Sorry, something went wrong.",
                        content: e,
                      });
                    });
                }}
              >
                Select...
              </button>
            </Row>
          </div>
        </Section>
      )
    );
  }

  function ClearDataSection() {
    return (
      config && (
        <Section
          title="Reset Software"
          description="Delete all your data and reset the software. This is irreversible, so be careful!"
        >
          <Row label="Reset">
            <button
              className="dangerPrimary"
              onClick={() => setDisplayResetDialog(true)}
            >
              Reset
            </button>
          </Row>
        </Section>
      )
    );
  }

  return (
    <Layout title="Settings">
      {displayUpdater && (
        <Dialog title={updaterStatus} content={updaterDescription}>
          {(
            ["Something went wrong", "You're up to date!"] as UpdaterStatus[]
          ).includes(updaterStatus) && (
            <>
              <button
                className="secondary"
                onClick={() => setDisplayUpdater(false)}
              >
                Okay
              </button>
            </>
          )}
        </Dialog>
      )}
      {displayResetDialog && (
        <Dialog
          title="Reset Software?"
          content="You are about to delete all Iris data. This action is irreversible. Are you sure?"
        >
          <>
            <button
              className="secondary"
              onClick={() => setDisplayResetDialog(false)}
            >
              Cancel
            </button>
            <button
              className="dangerPrimary"
              onClick={() => {
                invoke("delete_data")
                  .then()
                  .catch((error) => {
                    throw new Error(error);
                  });

                setDisplayResetDialog(false);
              }}
            >
              Yes
            </button>
          </>
        </Dialog>
      )}
      <div className={styles.containerSettings}>
        <div className={styles.columnOfContainers}>
          <ImportSection />
          <UpdaterSection />
        </div>
        <div className={styles.columnOfContainers}>
          <ClearDataSection />
        </div>
      </div>
      {displayDialog && (
        <Dialog
          title="Activate Relay?"
          content="By adding your phone number to this program, you consent to receiving messages about your patient's care. Messages such as when the patient takes their medication, new care instructions, and more. "
        >
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              alignContent: "center",
            }}
          >
            <button
              className="primary"
              onClick={() => {
                setDisplayDialog(!displayDialog);
              }}
            >
              I consent
            </button>
            <button
              className="secondary"
              onClick={() => {
                setDisplayDialog(!displayDialog);
              }}
            >
              Never mind
            </button>
          </div>
        </Dialog>
      )}
      {dataPackDialog.enabled && config && (
        <Dialog title={dataPackDialog.title} content={dataPackDialog.content}>
          <button
            className="primary"
            onClick={() =>
              setDataPackDialog({
                enabled: false,
                title: "",
                content: "",
              })
            }
          >
            Continue
          </button>
        </Dialog>
      )}
    </Layout>
  );
}
