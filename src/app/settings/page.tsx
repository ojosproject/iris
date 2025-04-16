// page.tsx
// Ojos Project
//
// The main page when users open the Settings icon.
"use client";
import { ReactElement, useEffect, useState } from "react";
import BackButton from "../components/BackButton";
import classes from "./page.module.css";
import { Switch } from "@mui/material";
import { Config } from "./types";
import Button from "../components/Button";
import { parse_phone_number } from "../helper";
import Dialog from "../components/Dialog";
import { invoke } from "@tauri-apps/api/core";
import useKeyPress from "../accessibility/keyboard_nav";
import { useRouter } from "next/navigation";
import Contacts from "../contacts/page";
import { Contact } from "../contacts/types";

type SectionProps = {
  children: ReactElement;
  title: string;
  description: string;
};

type RowProps = {
  children: ReactElement;
  label: string;
};

function Row({ children, label }: RowProps) {
  return (
    <label title={label} className={classes.label_row}>
      <p>{label}</p>
      {children}
    </label>
  );
}

function Section({ children, title, description }: SectionProps) {
  return (
    <div className={classes.column}>
      <h2>{title}</h2>
      <p>{description}</p>
      {children}
    </div>
  );
}

export default function Settings() {
  const [config, setConfig] = useState<Config | null>(null);
  const [displayDialog, setDisplayDialog] = useState(false);
  const [displayNumberDialog, setDisplayNumberDialog] = useState(false);
  const [dataPackDialog, setDataPackDialog] = useState({
    enabled: false,
    title: "",
    content: "",
  });
  const [relayActivated, setRelayActivated] = useState(false);
  const [newNumber, setNewNumber] = useState("");
  const [contacts, setContacts] = useState<Contact[]>([]);
  const router = useRouter();

  useEffect(() => {
    invoke<Config>("get_config").then((c) => {
      setConfig(c);
    });
    invoke<Contact[]>("get_all_contacts")
      .then((c) => {
        setContacts(c);

        setRelayActivated(c.some((v) => v.enabled_relay));
      })
      .catch((e) =>
        setDataPackDialog({
          enabled: true,
          title: "Sorry, something went wrong.",
          content: e,
        }),
      );
  }, []);

  useKeyPress("Escape", () => {
    if (displayDialog) {
      setDisplayDialog(false);
      setRelayActivated(false);
    } else if (displayNumberDialog) {
      setDisplayNumberDialog(false);
    } else {
      router.back();
    }
  });
  /*
  function RelaySection() {
    return (
      config && (
        <Section
          title="Relay Notifications"
          description="Relay your patient's care via SMS messages."
        >
          <div>
            <Row label="Relay Numbers?">
              <Switch
                defaultChecked={relayActivated}
                checked={relayActivated}
                onChange={() => {
                  setRelayActivated(!relayActivated);
                  if (!relayActivated) {
                    setDisplayDialog(!displayDialog);
                  } else {
                    invoke("disable_relay_for_contacts").catch((e) => {
                      console.log(e);
                    });
                  }
                }}
              ></Switch>
            </Row>

            {relayActivated && config && contacts.length > 1 && (
              <div>
                <h3>Push to these people...</h3>
                {contacts.map((c) => {
                  return (
                    c.phone_number &&
                    c.enabled_relay && (
                      <div className={classes.number_button_row}>
                        <p>{parse_phone_number(parseInt(c.phone_number))}</p>
                        <Button
                          type="SECONDARY"
                          label="Disable"
                          onClick={() => {
                            invoke<Contact>("update_contact", {
                              id: c.id,
                              name: c.name,
                              phone_number: c.phone_number,
                              company: c.company,
                              email: c.email,
                              contact_type: c.contact_type,
                              enabled_relay: false,
                            });
                          }}
                        />
                      </div>
                    )
                  );
                })}
              </div>
            )}

            {relayActivated && (
              <div className={classes.add_number_button}>
                <Button
                  type="PRIMARY"
                  label="Add Number"
                  onClick={() => {
                    setDisplayNumberDialog(true);
                  }}
                />
              </div>
            )}
          </div>
        </Section>
      )
    );
  }
*/
  function ImportSection() {
    type Receipt = {
      resources_count?: number;
      pro_count?: number;
      contacts_count?: number;
    };

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
                  invoke<Receipt>("import_data_pack")
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

  return (
    <div>
      <BackButton />
      <div className={classes.container_settings}>
        <h1>Settings</h1>
        <div className={classes.column_of_settings}>
          {/*<RelaySection />*/}
          <ImportSection />
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
                setRelayActivated(true);
              }}
            />
            <Button
              type="SECONDARY"
              label="Never mind"
              onClick={() => {
                setDisplayDialog(!displayDialog);
                setRelayActivated(false);
              }}
            />
          </div>
        </Dialog>
      )}
      {/*displayNumberDialog && config && (
        <Dialog
          title="Add Phone Number"
          content={
            'By selecting "Add number", I consent to receiving text messages about my patient\'s care.'
          }
        >
          <input
            placeholder="(000) 000-0000"
            style={{
              height: "35px",
              width: "250px",
              border: "solid black 2px",
              margin: "20px",
              outline: "none",
              borderRadius: "5px",
              textAlign: "center",
            }}
            type="text"
            value={parse_phone_number(newNumber)}
            onChange={(e) => {
              let cleanedNumber = "";
              e.target.value.split("").forEach((char) => {
                if (
                  ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"].includes(
                    char,
                  )
                ) {
                  cleanedNumber += char;
                }
              });
              if (cleanedNumber.length > 11) {
                return "";
              }
              setNewNumber(cleanedNumber === "" ? "" : cleanedNumber);
            }}
          />
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
              label="Add number"
              disabled={newNumber.length < 10}
              onClick={() => {
                setDisplayNumberDialog(!displayNumberDialog);
                if (
                  config.contacts.filter((contact) => {
                    return contact.value === newNumber.toString();
                  }).length === 0
                ) {
                  console.log(config.contacts);
                  console.log(newNumber);
                }
                setNewNumber("");
              }}
            />
            <Button
              type="SECONDARY"
              label="Cancel"
              onClick={() => {
                setDisplayNumberDialog(!displayNumberDialog);
                setNewNumber("");
              }}
            />
          </div>
        </Dialog>
      )*/}
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
    </div>
  );
}
