/**
 * File:     contacts/view/page.tsx
 * Purpose:  A single component's view/edit page.
 * Authors:  Ojos Project & Iris contributors
 * License:  GNU General Public License v3.0
 */
"use client";
import { useRouter, useSearchParams } from "next/navigation";
import styles from "./page.module.css";
import { Suspense, useEffect, useState } from "react";
import {
  parsePhoneNumber,
  sanitizePhoneNumber,
  timestampToString,
} from "@/utils/parsing";
import Dialog from "@/components/Dialog";
import Layout from "@/components/Layout";
import { createContact, getContact, updateContact } from "@/utils/contacts";

function EditContacts() {
  // If `id` is empty, you're creating a contact
  // If `id` has something, we're editing a contact

  const params = useSearchParams();
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [contactType, setContactType] = useState<"CAREGIVER" | "PATIENT">(
    "CAREGIVER",
  );
  const [enabledRelay, setEnabledRelay] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(0);
  const [onEditMode, setOnEditMode] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [saveMessage, setSaveMessage] = useState(false);
  const [justSaved, setJustSaved] = useState(false);

  const router = useRouter();

  useEffect(() => {
    async function initPage() {
      let paramsId = params.get("id");
      if (paramsId) {
        const contact = await getContact(paramsId);

        if (contact) {
          setId(contact.id);
          setName(contact.name);
          setPhoneNumber(
            contact.phone_number ? parsePhoneNumber(contact.phone_number) : "",
          );
          setCompany(contact.company ?? "");
          setEmail(contact.email ?? "");
          setContactType(contact.contact_type ?? "CAREGIVER");
          setEnabledRelay(contact.enabled_relay);
          setLastUpdated(contact.last_updated);
          setOnEditMode(!onEditMode);
        }
      } else {
        setOnEditMode(true);
      }
    }

    initPage();
  }, []);

  async function handleOnSaveClick() {
    // If last_updated is 0, it means that this is a newly created contact

    const contact =
      lastUpdated === 0
        ? await createContact(
            name,
            phoneNumber,
            company,
            email,
            contactType,
            enabledRelay,
          )
        : await updateContact(
            id,
            name,
            phoneNumber,
            company,
            email,
            contactType,
            enabledRelay,
          );

    setOnEditMode(false);
    setId(contact.id);
    setName(contact.name);
    setPhoneNumber(
      contact.phone_number ? parsePhoneNumber(contact.phone_number) : "",
    );
    setCompany(contact.company ?? "");
    setEmail(contact.email ?? "");
    setContactType(contact.contact_type ?? "CAREGIVER");
    setEnabledRelay(contact.enabled_relay);

    setJustSaved(true);
    setSaveMessage(true);

    // Hide the pop-up after 2 seconds
    setTimeout(() => {
      setSaveMessage(false);
      setJustSaved(false);
      router.push("/contacts");
    }, 1500);
  }
  return (
    <Layout
      title={
        justSaved
          ? ""
          : id
            ? `Edit ${name.split(" ")[0] || "a Contact"}`
            : "Create a Contact"
      }
      disabledBackButton={justSaved}
      handleBackClick={() => {
        if (!justSaved) {
          router.push("/contacts");
        }
      }}
    >
      <div className={styles.contactsContainer}>
        {saveMessage && (
          <Dialog title="Contact saved successfully!" content="">
            <></>
          </Dialog>
        )}
        <div className={styles.inputContainer}>
          {onEditMode ? (
            <>
              <div className={styles.inputGroup}>
                <label>
                  Name<span className={styles.required}>*</span>
                </label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Name"
                  className={styles.inputFields}
                  type="text"
                />
              </div>
              <div className={styles.inputGroup}>
                <label>Phone Number</label>
                <input
                  value={parsePhoneNumber(phoneNumber)}
                  onChange={(e) => {
                    let cleanedNumber = sanitizePhoneNumber(e.target.value);
                    setPhoneNumber(cleanedNumber === "" ? "" : cleanedNumber);
                  }}
                  placeholder="(123)-456-7890 (optional)"
                  className={styles.inputFields}
                  type="tel"
                />
              </div>
              <div className={styles.inputGroup}>
                <label>Email</label>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email@email.com (optional)"
                  className={styles.inputFields}
                  type="email"
                />
              </div>
              <div className={styles.inputGroup}>
                <label>Company</label>
                <input
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="Individual's employer (optional)"
                  className={styles.inputFields}
                  type="text"
                />
              </div>

              <div className={styles.buttonRow}>
                <button
                  className="secondary"
                  onClick={() => router.back()}
                  disabled={justSaved}
                >
                  Cancel
                </button>
                <button
                  className="primary"
                  onClick={handleOnSaveClick}
                  disabled={name === "" || justSaved}
                >
                  Save
                </button>
              </div>
            </>
          ) : null}

          {lastUpdated === 0 || justSaved ? null : (
            <div className={styles.lastUpdated}>
              <div className={styles.last_updatedInner}>
                <p>
                  Last updated on {timestampToString(lastUpdated, "MMDDYYYY")}
                </p>
                <p>at {timestampToString(lastUpdated, "HH:MM XX")}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

// Required to prevent
// https://github.com/ojosproject/iris/issues/36
export default function EditContactsWrapper() {
  return (
    <Suspense>
      <EditContacts />
    </Suspense>
  );
}
