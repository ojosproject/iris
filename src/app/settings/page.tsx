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
  const [relayActivated, setRelayActivated] = useState(false);

  useEffect(() => {
    /*invoke("get_config").then((c) => {
      setConfig(c as Config);
      if ((c as Config).contacts.length()) {
        setRelayActivated(true);
      }
    });*/
    setConfig({
      contacts: [],
      onboarding_completed: true,
      resources_last_call: 0,
    });
  }, []);

  function RelaySection({
    config,
    displayDialog,
    setDisplayDialog,
  }: {
    config: Config;
    displayDialog: boolean;
    setDisplayDialog: Function;
  }) {
    return (
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
                }
              }}
            ></Switch>
          </Row>

          {relayActivated && config.contacts.length !== 0 && (
            <div>
              <h3>Push to these numbers...</h3>
              {config.contacts.map((c) => {
                return (
                  <div className={classes.number_button_row}>
                    <p>{parse_phone_number(parseInt(c.value))}</p>
                    <Button
                      type="SECONDARY"
                      label="Delete"
                      onClick={() => {}}
                    />
                  </div>
                );
              })}
            </div>
          )}

          {relayActivated && (
            <div className={classes.add_number_button}>
              <Button type="PRIMARY" label="Add Number" onClick={() => {}} />
            </div>
          )}
        </div>
      </Section>
    );
  }

  return (
    <div>
      <BackButton />
      <div className={classes.container_settings}>
        <h1>Settings</h1>
        <div>
          {config && (
            <RelaySection
              config={config}
              displayDialog={displayDialog}
              setDisplayDialog={setDisplayDialog}
            />
          )}
        </div>
      </div>
      {displayDialog && (
        <Dialog
          title="Activate Relay?"
          content="By adding your phone number to this program, you consent to receiving messages about the hospice patient's care. Messages such as when the patient takes their medication, new care instructions, and more. "
        >
          <Button type="PRIMARY" label="I consent" onClick={() => {}} />
          <Button
            type="SECONDARY"
            label="Never mind"
            onClick={() => {
              setDisplayDialog(!displayDialog);
              setRelayActivated(false);
            }}
          />
        </Dialog>
      )}
    </div>
  );
}
