// contacts/page.tsx
// Ojos Project
//
// Displays all contacts associated with the user.
"use client";
import { Contact } from "./types";
import { invoke } from "@tauri-apps/api/core";
import { useEffect, useState } from "react";
import BackButton from "../core/components/BackButton";
import classes from "./page.module.css";
import Button from "../core/components/Button";
import ContactButton from "./components/ContactButton";

export default function Contacts() {
  const [contacts, setContacts] = useState([] as Contact[]);

  useEffect(() => {
    invoke("get_all_contacts").then((i) => {
      setContacts(i as Contact[]);
    });
  }, []);

  return (
    <div className={classes.all_contacts_layout}>
      <div className={classes.back_button}>
        <BackButton />
      </div>

      <h1>Contacts</h1>
      {contacts.length === 0 ? (
        <p>No Existing Contacts</p>
      ) : (
        contacts.map((contact) => {
          return (
            <ContactButton
              key={contact.id}
              contact={contact}
            />
          );
        })
      )}

      <div className={classes.button_menu_container}>
        <div className={classes.button_menu}>
          <Button
            type="PRIMARY"
            label="Add Contacts"
            link={{
              pathname: "./contacts/view/",
            }}
          />
        </div>
      </div>
    </div>
  );
}
