/**
 * File:     contacts/view/page.tsx
 * Purpose:  A single component's view/edit page.
 * Authors:  Ojos Project & Iris contributors
 * License:  GNU General Public License v3.0
 */
"use client";
import BackButton from "@/components/BackButton";
import { useRouter, useSearchParams } from "next/navigation";
import styles from "./page.module.css";
import Button from "@/components/Button";
import { Suspense, useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { Contact } from "@/types/contacts";
import {
  parsePhoneNumber,
  sanitizePhoneNumber,
  timestampToString,
} from "@/utils/parsing";
import Dialog from "@/components/Dialog";

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

  function fetchInformation(fetch_id: string) {
    invoke<Contact>("get_single_contact", { id: fetch_id }).then((i) => {
      setId(i.id);
      setName(i.name);
      setPhoneNumber(i.phone_number ? parsePhoneNumber(i.phone_number) : "");
      setCompany(i.company ?? "");
      setEmail(i.email ?? "");
      setContactType(i.contact_type ?? "CAREGIVER");
      setEnabledRelay(i.enabled_relay);
      setLastUpdated(i.last_updated);
      setOnEditMode(!onEditMode);
    });
  }

  useEffect(() => {
    let paramsId = params.get("id");
    if (paramsId) {
      fetchInformation(paramsId);
    } else {
      setOnEditMode(true);
    }
  }, []);

  function handleOnSaveClick() {
    // If last_updated is 0, it means that this is a newly created contact

    invoke<Contact>(lastUpdated === 0 ? "create_contact" : "update_contact", {
      id: id,
      name: name,
      phone_number: phoneNumber,
      company: company,
      email: email,
      contact_type: contactType,
      enabled_relay: enabledRelay,
    }).then((i) => {
      setOnEditMode(false);
      setId(i.id);
      setName(i.name);
      setPhoneNumber(i.phone_number ? parsePhoneNumber(i.phone_number) : "");
      setCompany(i.company ?? "");
      setEmail(i.email ?? "");
      setContactType(i.contact_type ?? "CAREGIVER");
      setEnabledRelay(i.enabled_relay);

      setJustSaved(true);
      setSaveMessage(true);

      // Hide the pop-up after 2 seconds
      setTimeout(() => {
        setSaveMessage(false);
        setJustSaved(false);
        router.push("/contacts");
      }, 1500);
    });
  }
  return (
    <div className={styles.contactsContainer}>
      <div className={styles.backButton}>
        <BackButton
          disabled={justSaved}
          onClick={() => {
            if (!justSaved) {
              router.push("/contacts");
            }
          }}
        />
      </div>

      {saveMessage && (
        <Dialog title="Contact saved successfully!" content="">
          <></>
        </Dialog>
      )}

      <h1 className={styles.contactName}>Add/Edit Contact</h1>

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
              <Button
                type="SECONDARY"
                label="Cancel"
                onClick={() => router.back()}
                disabled={justSaved}
              />
              <Button
                type="PRIMARY"
                label="Save"
                onClick={handleOnSaveClick}
                disabled={name === "" || justSaved}
              />
            </div>
          </>
        ) : null}

        {lastUpdated === 0 ? null : (
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
