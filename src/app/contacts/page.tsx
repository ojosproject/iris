/**
 * File:     contacts/page.tsx
 * Purpose:  Displays all contacts associated with the user.
 * Authors:  Ojos Project & Iris contributors
 * License:  GNU General Public License v3.0
 */
"use client";
import { Contact } from "@/types/contacts";
import { useEffect, useState } from "react";
import styles from "./page.module.css";
import Dialog from "@/components/Dialog";
import { parsePhoneNumber } from "@/utils/parsing";
import { useRouter } from "next/navigation";
import Layout from "@/components/Layout";
import Link from "next/link";
import { deleteContact, getContacts } from "@/utils/contacts";

export default function Contacts() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [patientId, setPatientId] = useState("");
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedContactIds, setSelectedContactIds] = useState<Set<string>>(
    new Set(),
  );
  const router = useRouter();

  useEffect(() => {
    async function initPage() {
      const c = await getContacts();
      const patient = c.find((cont) => cont.contact_type === "PATIENT");
      setContacts(c);

      if (patient) {
        setPatientId(patient.id);
      }
    }

    initPage();
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

  function toggleSelectContact(contact: Contact) {
    const id = contact.id;
    setSelectedContactIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
    setSelectedContact(contact);
  }

  return (
    <Layout title="Contacts" handleBackClick={() => router.push("/")}>
      <div className={styles.allContactsLayout}>
        {contacts.length === 0 ? (
          <p>No Existing Contacts</p>
        ) : (
          <div className={styles.contactsContainer}>
            <div className={styles.contactsList}>
              {Object.keys(groupedContacts)
                .sort()
                .map((letter) => (
                  <div key={letter}>
                    <h2>{letter}</h2>
                    {groupedContacts[letter].map((contact) => (
                      <div key={contact.id} className={styles.contactItem}>
                        <input
                          type="checkbox"
                          checked={selectedContactIds.has(contact.id)}
                          onChange={() => toggleSelectContact(contact)}
                        />
                        <p
                          className={styles.contactName}
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
            <div className={styles.contactDetails}>
              {selectedContact ? (
                <>
                  <h2>{selectedContact.name}</h2>
                  <p>
                    <strong>Phone Number:</strong>{" "}
                    {selectedContact.phone_number
                      ? parsePhoneNumber(selectedContact.phone_number)
                      : "N/A"}
                  </p>
                  <p>
                    <strong>Email:</strong> {selectedContact.email || "N/A"}
                  </p>
                  <p>
                    <strong>Company:</strong> {selectedContact.company || "N/A"}
                  </p>
                  <div className={styles.buttonGroup}>
                    <button
                      className="dangerSecondary"
                      onClick={() => {
                        setModalOpen(true);
                      }}
                      disabled={selectedContact.contact_type === "PATIENT"}
                    >
                      Delete
                    </button>

                    <Link
                      className="linkButton"
                      href={{
                        pathname: "./contacts/view/",
                        query: { id: selectedContact.id },
                      }}
                    >
                      <button className="primary">Edit</button>
                    </Link>
                  </div>
                </>
              ) : (
                <div className={styles.placeholder}>
                  <p> Select a contact to view its details.</p>
                </div>
              )}
            </div>
            <div></div>
          </div>
        )}
        {selectedContactIds.size > 0 && (
          <div className={styles.deleteSelectedContainer}>
            <button
              className="dangerPrimary"
              onClick={() => setModalOpen(true)}
              disabled={selectedContactIds.has(patientId as any)}
            >
              {selectedContactIds.has(patientId as any)
                ? "Cannot Delete Patient"
                : `Delete Selected (${selectedContactIds.size})`}
            </button>
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
              <button
                className="dangerPrimary"
                onClick={async () => {
                  isModalOpen(false);
                  const idsToDelete = Array.from(selectedContactIds);
                  if (idsToDelete.length > 0) {
                    for (const id of idsToDelete) {
                      await deleteContact(id);
                      setContacts((prev) =>
                        prev.filter(
                          (c) => !selectedContactIds.has(c.id as any),
                        ),
                      );
                    }
                  } else if (selectedContact && !idsToDelete.length) {
                    await deleteContact(selectedContact.id);
                    setContacts((prev) =>
                      prev.filter((c) => c.id !== selectedContact.id),
                    );
                  }

                  setSelectedContactIds(new Set());
                  setSelectedContact(null);
                }}
              >
                Delete
              </button>
              <button
                className="secondary"
                onClick={() => {
                  isModalOpen(false);
                }}
              >
                Never mind
              </button>
            </div>
          </Dialog>
        )}

        <div className={styles.buttonMenuContainer}>
          <div className={styles.buttonMenu}>
            <Link
              className="linkButton"
              href={{
                pathname: "./contacts/view/",
              }}
            >
              <button className="primary">Add Contacts</button>
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}
