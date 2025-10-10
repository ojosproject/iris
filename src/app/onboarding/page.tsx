/**
 * File:     onboarding/page.tsx
 * Purpose:  Initializes the onboarding process in Iris.
 * Authors:  Ojos Project & Iris contributors
 * License:  GNU General Public License v3.0
 */
"use client";
import styles from "./page.module.css";
import { useRouter } from "next/navigation";
import Dialog from "@/components/Dialog";
import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { DataPackReceipt } from "@/types/settings";
import Layout from "@/components/Layout";
import { getConfig } from "@/utils/settings";

export default function Onboarding() {
  const router = useRouter();
  const [dataPackDialog, setDataPackDialog] = useState({
    enabled: false,
    title: "",
    content: "",
    hideSelectButton: false,
  });

  useEffect(() => {
    async function initPage() {
      const providerConfig = await getConfig("provider");

      if (!providerConfig.onboarding_completed) {
        router.push("/onboarding/provider");
      }
    }
    initPage();
  }, []);

  return (
    <Layout title=" " disabledBackButton={true}>
      <div className={styles.onboardingCenter}>
        {dataPackDialog.enabled && (
          <Dialog title={dataPackDialog.title} content={dataPackDialog.content}>
            <button
              className={
                dataPackDialog.hideSelectButton ? "primary" : "secondary"
              }
              onClick={() =>
                setDataPackDialog({
                  enabled: false,
                  title: "",
                  content: "",
                  hideSelectButton: false,
                })
              }
            >
              {dataPackDialog.hideSelectButton ? "Done" : "Back"}
            </button>
            {!dataPackDialog.hideSelectButton && (
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
                        hideSelectButton: false,
                      });
                    })
                    .catch((e) => {
                      setDataPackDialog({
                        enabled: true,
                        title: "Sorry, something went wrong.",
                        content: e,
                        hideSelectButton: true,
                      });
                    });

                  setDataPackDialog({
                    enabled: false,
                    title: "",
                    content: "",
                    hideSelectButton: false,
                  });
                }}
              >
                Select JSON...
              </button>
            )}
          </Dialog>
        )}
        <h1>Welcome to Iris!</h1>
        <h3>Your care management system</h3>

        <div className={styles.buttonOnBottom}>
          {/*<button
            className="secondary"
            onClick={() => {
              setDataPackDialog({
                enabled: true,
                title: "Have a Data Pack?",
                content:
                  "You can import contacts, resources, and survey questions using JavaScript Object Notation. If you have one, you can import it here.",
                hideSelectButton: false,
              });
            }}
          >
            Import Data Pack
          </button>*/}
          <button
            className="primary"
            onClick={() => {
              router.push("/onboarding/patient/");
            }}
          >
            Get Started
          </button>
        </div>
      </div>
    </Layout>
  );
}
