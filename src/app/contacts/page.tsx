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
import Dialog from "@/app/core/components/Dialog";
import { parse_phone_number } from "../core/helper";

export default function Contacts() {
  const [contacts, setContacts] = useState([] as Contact[]);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedContactIds, setSelectedContactIds] = useState<Set<number>>(
    new Set(),
  );

  useEffect(() => {
    invoke("get_all_contacts").then((i) => {
      setContacts(i as Contact[]);
    });
  }, []);

  // Group contacts alphabetically
  const groupedContacts = contacts.reduce(
    (acc, contact) => {
      const firstLetter = contact.name[0].toUpperCase();
      if (!acc[firstLetter]) acc[firstLetter] = [];
      acc[firstLetter].push(contact);
      return acc;
    },
    {} as Record<string, Contact[]>,
  );

  function isModalOpen(valueForModal: boolean) {
    if (valueForModal === false) {
      document.body.style.overflow = "";
    } else {
      document.body.style.overflow = "hidden";
    }
    setModalOpen(valueForModal);
  }

  function toggleSelectContact(id: number) {
    setSelectedContactIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  }

  return (
    <div className={classes.all_contacts_layout}>
      <div className={classes.back_button}>
        <BackButton />
      </div>

      <h1>Contacts</h1>
      {contacts.length === 0 ? (
        <p>No Existing Contacts</p>
      ) : (
        <div className={classes.contacts_container}>
          <div className={classes.contacts_list}>
            {Object.keys(groupedContacts)
              .sort()
              .map((letter) => (
                <div key={letter}>
                  <h2>{letter}</h2>
                  {groupedContacts[letter].map((contact) => (
                    <div key={contact.id} className={classes.contact_item}>
                      <input
                        type="checkbox"
                        checked={selectedContactIds.has(contact.id as any)}
                        onChange={() => toggleSelectContact(contact.id as any)}
                      />
                      <p
                        className={classes.contact_name}
                        onClick={() => {
                          setSelectedContact(contact);
                        }}
                      >
                        <strong>{contact.name}</strong>
                      </p>
                    </div>
                  ))}
                </div>
              ))}
          </div>
          <div className={classes.contact_details}>
            {selectedContact ? (
              <>
                <h2>{selectedContact.name}</h2>
                <p>
                  <strong>Phone Number:</strong>{" "}
                  {selectedContact.phone_number
                    ? parse_phone_number(selectedContact.phone_number)
                    : "N/A"}
                </p>
                <p>
                  <strong>Email:</strong> {selectedContact.email || "N/A"}
                </p>
                <p>
                  <strong>Company:</strong> {selectedContact.company || "N/A"}
                </p>
                <div className={classes.button_group}>
                  <Button
                    type="DANGER-SECONDARY"
                    label="Delete"
                    onClick={() => {
                      setModalOpen(true);
                    }}
                  />
                  <Button
                    type="PRIMARY"
                    label="Edit"
                    link={{
                      pathname: "./contacts/view/",
                      query: { id: selectedContact.id },
                    }}
                  />
                </div>
              </>
            ) : (
              <div className={classes.placeholder}>
                <p> Select a contact to view its details.</p>
              </div>
            )}
          </div>
          <div></div>
        </div>
      )}
      {selectedContactIds.size > 0 && (
        <div className={classes.delete_selected_container}>
          <Button
            type="DANGER-PRIMARY"
            label={`Delete Selected (${selectedContactIds.size})`}
            onClick={() => setModalOpen(true)}
          />
        </div>
      )}

      {modalOpen && (
        <Dialog
          title="Are you sure?"
          content={"Deleted contacts cannot be recovered."}
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
              type="DANGER-PRIMARY"
              label="Delete"
              onClick={async () => {
                isModalOpen(false);
                const idsToDelete = Array.from(selectedContactIds);
                if (idsToDelete.length > 0) {
                  for (const id of idsToDelete) {
                    await invoke("delete_contact", { id });
                    setContacts((prev) =>
                      prev.filter((c) => !selectedContactIds.has(c.id as any)),
                    );
                  }
                } else if (selectedContact && !idsToDelete.length) {
                  await invoke("delete_contact", { id: selectedContact.id });
                  setContacts((prev) =>
                    prev.filter((c) => c.id !== selectedContact.id),
                  );
                }

                setSelectedContactIds(new Set());
                setSelectedContact(null);
              }}
            />
            <Button
              type="SECONDARY"
              label="Never mind"
              onClick={() => {
                isModalOpen(false);
              }}
            />
          </div>
        </Dialog>
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
