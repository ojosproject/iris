// page.tsx
// Ojos Project
//
// The main page when users open the Settings icon.
"use client";
import { ReactElement, useEffect, useState } from "react";
import BackButton from "../core/components/BackButton";
import classes from "./page.module.css";
import { Switch } from "@mui/material";
import { Config } from "../core/types";
import Button from "../core/components/Button";
import { parse_phone_number } from "../core/helper";
import Dialog from "../core/components/Dialog";
import { invoke } from "@tauri-apps/api/core";
import useKeyPress from "../accessibility/keyboard_nav";
import { useRouter } from "next/navigation";

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
  const [relayActivated, setRelayActivated] = useState(false);
  const [newNumber, setNewNumber] = useState("");
  const router = useRouter();

  useEffect(() => {
    invoke("get_config").then((c) => {
      setConfig(c as Config);
      if ((c as Config).contacts.length) {
        setRelayActivated(true);
      }
    });
  }, []);

  function commitConfig(newConfig: Config) {
    invoke("set_config", { config: newConfig });
    setConfig(newConfig);
  }

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


  useKeyPress("Enter", () => {
    if (displayNumberDialog && newNumber.length >= 10 && config) {
      setDisplayNumberDialog(false);
      if (!config.contacts.some(contact => contact.value === newNumber)) {
        commitConfig({
          onboarding_completed: config.onboarding_completed,
          resources_last_call: config.resources_last_call,
          contacts: [
            ...config.contacts,
            { method: "SMS", value: newNumber },
          ],
          pro_questions: config.pro_questions,
        });
      }
      setNewNumber("");
    }
  });
  

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
                    commitConfig({
                      contacts: [],
                      onboarding_completed: config.onboarding_completed,
                      resources_last_call: config.resources_last_call,
                      pro_questions: config.pro_questions,
                    });
                  }
                }}
              ></Switch>
            </Row>

            {relayActivated && config && config.contacts.length !== 0 && (
              <div>
                <h3>Push to these numbers...</h3>
                {config.contacts.map((c) => {
                  return (
                    <div className={classes.number_button_row}>
                      <p>{parse_phone_number(parseInt(c.value))}</p>
                      <Button
                        type="SECONDARY"
                        label="Delete"
                        onClick={() => {
                          commitConfig({
                            onboarding_completed: config.onboarding_completed,
                            resources_last_call: config.resources_last_call,
                            contacts: config.contacts.filter(
                              (contact) => contact.value !== c.value,
                            ),
                            pro_questions: config.pro_questions,
                          });
                        }}
                      />
                    </div>
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

  return (
    <div>
      <BackButton />
      <div className={classes.container_settings}>
        <h1>Settings</h1>
        <div className={classes.column_of_settings}>
          <RelaySection />
        </div>
      </div>
      {displayDialog && (
        <Dialog
          title="Activate Relay?"
          content="By adding your phone number to this program, you consent to receiving messages about the hospice patient's care. Messages such as when the patient takes their medication, new care instructions, and more. "
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
      {displayNumberDialog && config && (
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
                  commitConfig({
                    onboarding_completed: config!.onboarding_completed,
                    resources_last_call: config!.resources_last_call,
                    contacts: [
                      ...config!.contacts,
                      { method: "SMS", value: newNumber },
                    ],
                    pro_questions: config!.pro_questions,
                  });
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
      )}
    </div>
  );
}
