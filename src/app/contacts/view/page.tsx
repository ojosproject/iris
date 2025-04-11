// contacts/view/page.tsx
// Ojos Project

"use client";
import BackButton from "@/app/core/components/BackButton";
import { useRouter, useSearchParams } from "next/navigation";
import classes from "./page.module.css";
import Button from "@/app/core/components/Button";
import { Suspense, useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { Contact } from "../types";
import { timestampToString } from "@/app/core/helper";
import ToastDialog from "@/app/core/components/ToastDialog";

function EditContacts() {
  // If `id` is empty, you're creating a contact
  // If `id` has something, we're editing a contact

  const params = useSearchParams();
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [lastUpdated, setLastUpdated] = useState(0);
  const [onEditMode, setOnEditMode] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [saveMessage, setSaveMessage] = useState(false);
  const [justSaved, setJustSaved] = useState(false);

  const router = useRouter();

  function fetchInformation(fetch_id: string) {
    invoke("get_single_contact", { id: fetch_id })
      .then((i) => {
        setId((i as Contact).id);
        setName((i as Contact).name);
        setPhoneNumber((i as Contact).phone_number ?? "");
        setCompany((i as Contact).company ?? "");
        setEmail((i as Contact).email ?? "");
        setLastUpdated((i as Contact).last_updated);
        setOnEditMode(!onEditMode);
      })
      .catch((e) => console.log(e));
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

    invoke(lastUpdated === 0 ? "create_contact" : "update_contact", {
      id: id,
      name: name,
      phone_number: phoneNumber,
      company: company,
      email: email,
    }).then((i) => {
      setOnEditMode(false);
      setId((i as Contact).id);
      setName((i as Contact).name);
      setPhoneNumber((i as Contact).phone_number ?? "");
      setCompany((i as Contact).company ?? "");
      setEmail((i as Contact).email ?? "");

      setJustSaved(true);
      setSaveMessage(true);

      // Hide the pop-up after 2 seconds
      setTimeout(() => {
        setSaveMessage(false);
        setJustSaved(false);
        router.back();
      }, 1500);
    });
  }
  return (
    <div className={classes.contacts_container}>
      <div className={classes.back_button}>
        <BackButton disabled={justSaved} />
      </div>

      {saveMessage && (
        <ToastDialog title="Contact saved successfully!" content="">
          <></>
        </ToastDialog>
      )}

      <h1 className={classes.contact_name}>Add/Edit Contact</h1>

      <div className={classes.input_container}>
        {onEditMode ? (
          <>
            <div className={classes.input_group}>
              <label>
                Name<span className={classes.required}>*</span>
              </label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Name"
                className={classes.input_fields}
                type="text"
              />
            </div>
            <div className={classes.input_group}>
              <label>Phone Number</label>
              <input
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="(123)-456-7890 (optional)"
                className={classes.input_fields}
                type="tel"
              />
            </div>
            <div className={classes.input_group}>
              <label>Email</label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@email.com (optional)"
                className={classes.input_fields}
                type="email"
              />
            </div>
            <div className={classes.input_group}>
              <label>Company</label>
              <input
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="Individual's employer (optional)"
                className={classes.input_fields}
                type="text"
              />
            </div>

            <div className={classes.button_row}>
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
          <div className={classes.last_updated}>
            <div className={classes.last_updated_inner}>
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
export default function EditInstructionsWrapper() {
  return (
    <Suspense>
      <EditContacts />
    </Suspense>
  );
}
