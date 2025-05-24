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
import Button from "@/components/Button";
import Dialog from "@/components/Dialog";
import { invoke } from "@tauri-apps/api/core";
import useKeyPress from "@/components/useKeyPress";
import { useRouter } from "next/navigation";
import ConfirmUpdateDialog from "./_components/ConfirmUpdateDialog";
import Layout from "@/components/Layout";

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
    } else {
      router.back();
    }
  });

  function UpdaterSection() {
    return (
      config && (
        <Section
          title="Updates"
          description="Request software updates and automatically install them."
        >
          <Row label="Request Updates">
            <Button
              type="PRIMARY"
              label={updateButtonLabel}
              disabled={updateButtonDisabled}
              onClick={() => {
                if (!updateButtonDisabled) {
                  setDisplayUpdater(true);
                }
              }}
            ></Button>
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
              <Button
                type="PRIMARY"
                label="Select..."
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
              />
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
            <Button
              type="DANGER-PRIMARY"
              label="Reset"
              onClick={() => setDisplayResetDialog(true)}
            />
          </Row>
        </Section>
      )
    );
  }

  return (
    <Layout title="Settings">
      {displayUpdater && (
        <ConfirmUpdateDialog
          onRequest={() => {
            setUpdateButtonDisabled(true);
            setUpdateButtonLabel("Requested");
          }}
          closeModel={() => setDisplayUpdater(false)}
        />
      )}
      {displayResetDialog && (
        <Dialog
          title="Reset Software?"
          content="You are about to delete all Iris data. This action is irreversible. Are you sure?"
        >
          <>
            <Button
              type="SECONDARY"
              label="Cancel"
              onClick={() => setDisplayResetDialog(false)}
            />
            <Button
              type="DANGER-PRIMARY"
              label="Yes"
              onClick={() => {
                invoke("delete_data")
                  .then()
                  .catch((error) => {
                    throw new Error(error);
                  });

                setDisplayResetDialog(false);
              }}
            />
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
            <Button
              type="PRIMARY"
              label="I consent"
              onClick={() => {
                setDisplayDialog(!displayDialog);
              }}
            />
            <Button
              type="SECONDARY"
              label="Never mind"
              onClick={() => {
                setDisplayDialog(!displayDialog);
              }}
            />
          </div>
        </Dialog>
      )}
      {dataPackDialog.enabled && config && (
        <Dialog title={dataPackDialog.title} content={dataPackDialog.content}>
          <Button
            type="PRIMARY"
            label="Continue"
            onClick={() =>
              setDataPackDialog({
                enabled: false,
                title: "",
                content: "",
              })
            }
          />
        </Dialog>
      )}
    </Layout>
  );
}
