"use client";
import React, { useState, useEffect } from "react";
import styles from "./page.module.css";
import { Medication, MedicationLog } from "./types";
import { invoke } from "@tauri-apps/api/core";
import BackButton from "../components/BackButton";
import Button from "../components/Button";
import ConfirmLogModal from "./components/ConfirmLogModal";
import { timestampToString } from "../helper";
import useKeyPress from "../accessibility/keyboard_nav";
import { useRouter } from "next/navigation";
import MedicationForm from "./add_medication/page";
import Image from "next/image";
import Dialog from "../components/Dialog";
import MedicationIconPicker from "./components/MedicationIconPicker";

const MedicationsView = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };
  const [selectedMedication, setSelectedMedication] =
    useState<Medication | null>(null);
  const handleLogClick = (medication: Medication) => {
    setSelectedMedication(medication);
    setIsConfirmLogModalOpen(true);
    invoke("update_medication", {
      id: medication.id,
      quantity: medication.quantity - medication.strength,
    });
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
    invoke<Medication[]>("get_medications")
      .then((m) => {
        setMedications(m);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching medications", err);
        setLoading(false);
      });
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

    invoke<Medication>("create_medication", {
      name: newMedication.name,
      generic_name: newMedication.generic_name
        ? newMedication.generic_name
        : null,
      dosage_type: newMedication.dosage_type,
      strength: newMedication.strength,
      units: newMedication.units,
      quantity: newMedication.quantity,
      start_date: newMedication.start_date,
      end_date: newMedication.end_date,
      expiration_date: newMedication.expiration_date,
      frequency: newMedication.frequency,
      notes: newMedication.notes,
      icon: newMedication.icon,
    })
      .then((m) => {
        setMedications([...medications, m]);
      })
      .catch((err) => {
        console.error(err);
      });
    handleNewMedModelClose();
  };

  const handleCommentSubmit = (comment: string) => {
    if (selectedMedication) {
      // Send the medication and comment to your backend or perform the necessary action
      invoke("log_medication", {
        id: selectedMedication.id,
        strength: selectedMedication.strength,
        units: selectedMedication.units,
        comments: comment || null,
      }).then(() => {
        // After logging the medication, refresh the list of medications
        invoke<Medication[]>("get_medications")
          .then((medications) => {
            setMedications(medications);
            setLoading(false);
          })
          .catch((err) => {
            console.error("Error fetching medications", err);
            setLoading(false);
          });
      });

      setIsConfirmLogModalOpen(false); // Close the modal after submission
    }
  };

  return (
    <>
      <BackButton />
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
          <h1>Your Medications</h1>
          <div className={styles.searchBarContainer}>
            <input
              type="text"
              placeholder="Search Medication..."
              value={searchQuery}
              onChange={handleSearchChange}
              className={styles.searchInput}
            />
            <Button
              type="PRIMARY"
              label="Add Medication"
              onClick={handleOpenForm}
            />
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
                        src={`/images/${medication.icon}`}
                        alt={`Icon for ${medication.name}.`}
                        height={80}
                        width={80}
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
                    <Button
                      type="PRIMARY"
                      label="Log"
                      onClick={() => handleLogClick(medication)}
                    />
                    <Button
                      type="SECONDARY"
                      label="View"
                      link={{
                        pathname: "/medications/view/",
                        query: {
                          id: medication.id,
                        },
                      }}
                    />
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
            onSelect={(newIcon: string) => {
              setIconDialogOpen(false);
              invoke("update_medication", {
                id: selectedMedication.id,
                icon: newIcon,
              }).then(() => {
                invoke<Medication[]>("get_medications").then((meds) => {
                  setMedications(meds);
                });
              });
            }}
          />
          <Button
            type="SECONDARY"
            label="Cancel"
            onClick={() => setIconDialogOpen(false)}
          />
        </Dialog>
      )}
    </>
  );
};

export default MedicationsView;
