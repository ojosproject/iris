/**
 * File:     medications/page.tsx
 * Purpose:  The Medications page.
 * Authors:  Ojos Project & Iris contributors
 * License:  GNU General Public License v3.0
 */
"use client";
import React, { useState, useEffect } from "react";
import styles from "./page.module.css";
import { Medication } from "@/types/medications";
import { invoke } from "@tauri-apps/api/core";
import ConfirmLogModal from "./_components/ConfirmLogModal";
import { timestampToString } from "@/utils/parsing";
import useKeyPress from "@/components/useKeyPress";
import { useRouter } from "next/navigation";
import MedicationForm from "./_components/MedicationForm";
import Image from "next/image";
import Dialog from "@/components/Dialog";
import MedicationIconPicker from "./_components/MedicationIconPicker";
import Layout from "@/components/Layout";
import Link from "next/link";
import {
  createMedication,
  getMedications,
  logMedication,
  setMedicationIcon,
  setMedicationQuantity,
} from "@/utils/medications";

export default function MedicationView() {
  const [searchQuery, setSearchQuery] = useState("");
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };
  const [selectedMedication, setSelectedMedication] =
    useState<Medication | null>(null);
  const handleLogClick = async (medication: Medication) => {
    setSelectedMedication(medication);
    setIsConfirmLogModalOpen(true);
    await setMedicationQuantity(
      medication.id,
      medication.quantity - medication.strength,
    );
  };
  const [isNewMedFormOpen, setIsNewMedFormOpen] = useState(false);
  const [isConfirmLogModalOpen, setIsConfirmLogModalOpen] = useState(false);
  const [medications, setMedications] = useState<Medication[]>([]);
  const [loading, setLoading] = useState(true);
  const [iconDialogOpen, setIconDialogOpen] = useState(false);
  const router = useRouter();

  useKeyPress("Escape", () => {
    if (isNewMedFormOpen) {
      setIsNewMedFormOpen(false);
    } else if (isConfirmLogModalOpen) {
      setIsConfirmLogModalOpen(false);
    } else if (iconDialogOpen) {
      setIconDialogOpen(false);
    } else {
      router.back();
    }
  });

  const handleOpenForm = () => {
    setIsNewMedFormOpen(true);
  };
  const handleNewMedModelClose = () => {
    setIsNewMedFormOpen(false);
  };
  const filteredMedications = medications.filter((medication) =>
    medication.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  useEffect(() => {
    async function initPage() {
      setMedications(await getMedications("all"));
      setLoading(false);
    }
    initPage();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  // Function to handle the submission of new medication
  const handleNewMedModelSubmit = async (newMedication: Medication) => {
    const exists = medications.some(
      (med) => med.name.toLowerCase() === newMedication.name.toLowerCase(),
    );

    if (exists) {
      return;
    }

    setMedications((prevMedications) => [...prevMedications, newMedication]);

    const m = await createMedication(
      newMedication.name,
      newMedication.generic_name,
      newMedication.dosage_type,
      newMedication.strength,
      newMedication.units,
      newMedication.quantity,
      newMedication.start_date,
      newMedication.end_date,
      newMedication.expiration_date,
      newMedication.frequency,
      newMedication.notes,
      newMedication.icon,
    );
    setMedications([...medications, m]);
    handleNewMedModelClose();
  };

  const handleCommentSubmit = async (comment: string) => {
    if (selectedMedication) {
      // Send the medication and comment to your backend or perform the necessary action
      await logMedication(
        selectedMedication.id,
        selectedMedication.strength,
        selectedMedication.units,
        comment || "",
      );
      setMedications(await getMedications("all"));
      setLoading(false);
      setIsConfirmLogModalOpen(false); // Close the modal after submission
    }
  };

  return (
    <Layout
      title={isNewMedFormOpen ? "Add a Medication" : "Your Medications"}
      handleBackClick={
        isNewMedFormOpen
          ? () => {
              setIsNewMedFormOpen(false);
            }
          : undefined
      }
    >
      {isNewMedFormOpen ? (
        <div className={styles.medicationFormPage}>
          <MedicationForm
            isOpen={isNewMedFormOpen}
            onClose={handleNewMedModelClose}
            onSubmit={handleNewMedModelSubmit}
          />
        </div>
      ) : (
        <div className={styles.container}>
          <div className={styles.searchBarContainer}>
            <input
              type="text"
              placeholder={
                medications.length > 0 ? "Search Medications" : "No Medications"
              }
              value={searchQuery}
              onChange={handleSearchChange}
              className={styles.searchInput}
              disabled={medications.length === 0}
            />
            <button className="primary" onClick={handleOpenForm}>
              Add Medication
            </button>
          </div>
          <ConfirmLogModal
            isOpen={isConfirmLogModalOpen}
            title={`Log ${selectedMedication ? `${selectedMedication.name}? (${selectedMedication.strength}${selectedMedication.units})` : "medication?"}`}
            onClose={() => setIsConfirmLogModalOpen(false)}
            medication={selectedMedication}
            onConfirm={handleCommentSubmit}
          />
          <div className={styles.medsWrap}>
            {filteredMedications.length === 0 ? (
              <div className={styles.emptyMessage}>No medications found.</div>
            ) : (
              filteredMedications.map((medication, index) => (
                <div key={index} className={styles.logMeds}>
                  <div className={styles.logName}>
                    <strong>{medication.name}</strong>
                  </div>
                  {["tablet", "injection"].includes(medication.dosage_type) ? (
                    <button
                      style={{ backgroundColor: "transparent", border: "none" }}
                      onClick={() => {
                        setSelectedMedication(medication);
                        setIconDialogOpen(true);
                      }}
                    >
                      <Image
                        src={`/images/medication-icons/${medication.icon}`}
                        alt={`Icon for ${medication.name}.`}
                        height={80}
                        width={80}
                        draggable={false}
                      />
                    </button>
                  ) : (
                    <div className={styles.circle}></div> /* Circle */
                  )}

                  <div className={styles.logDosage}>
                    {medication.strength.toString() + " " + medication.units}
                  </div>
                  <div className={styles.logLastTake}>
                    <strong>Last taken</strong>
                    <br />
                    <>
                      {medication.last_taken
                        ? `${timestampToString(medication.last_taken, "MMDDYYYY")} @ ${timestampToString(medication.last_taken, "HH:MM XX")}`
                        : "Not yet taken."}
                    </>
                  </div>
                  <div key={medication.name} className={styles.logButtons}>
                    <button
                      className="primary"
                      onClick={() => handleLogClick(medication)}
                    >
                      Log
                    </button>

                    <Link
                      className="linkButton"
                      href={{
                        pathname: "/medications/view/",
                        query: {
                          id: medication.id,
                        },
                      }}
                    >
                      <button className="secondary">View</button>
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
      {iconDialogOpen && selectedMedication && (
        <Dialog
          title={`Edit Icon for ${selectedMedication.name}`}
          content="Select an icon below."
        >
          <MedicationIconPicker
            medium={selectedMedication.dosage_type}
            selectedIcon={selectedMedication.icon}
            onSelect={async (newIcon: string) => {
              setIconDialogOpen(false);
              await setMedicationIcon(selectedMedication.id, newIcon);
              setMedications(await getMedications("all"));
            }}
          />
          <button
            className="secondary"
            onClick={() => setIconDialogOpen(false)}
          >
            Cancel
          </button>
        </Dialog>
      )}
    </Layout>
  );
}
