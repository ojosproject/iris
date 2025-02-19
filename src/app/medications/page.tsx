"use client";
import React, { useState, useEffect } from "react";
import styles from "./page.module.css";
import { Medication } from "./types";
import { invoke } from "@tauri-apps/api/core";
import BackButton from "../core/components/BackButton";
import Button from "../core/components/Button";
import ConfirmLogModal from "./components/ConfirmLogModal";
import { timestampToString } from "../core/helper";
import MedicationForm from "./add_medication/page";

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
  };
  const [isNewMedFormOpen, setIsNewMedFormOpen] = useState(false);
  const [isConfirmLogModalOpen, setIsConfirmLogModalOpen] = useState(false);
  const [medications, setMedications] = useState<Medication[]>([]);
  const [loading, setLoading] = useState(true);
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
    invoke("get_medications")
      .then((m) => {
        setMedications(m as Medication[]);
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

    invoke("create_medication", {
      name: newMedication.name,
      dosage: newMedication.strength,
      frequency: newMedication.frequency,
      supply: newMedication.quantity,
      measurement: newMedication.units,
      //nurse_id: newMedication.nurse_id,
    });

    setMedications([...medications, newMedication]);
    handleNewMedModelClose();
  };

  return (
    <>
      <BackButton />
      {isNewMedFormOpen ? (
        // Render MedicationForm as a separate page-like section
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
            onClose={() => setIsConfirmLogModalOpen(false)}
            medication={selectedMedication}
            onConfirm={() => {
              invoke("log_medication", {
                medication: selectedMedication?.name,
                comments: comment || null,
              }).then((ts) => {
                invoke("get_medications")
                  .then((m) => {
                    setMedications(m as Medication[]);
                    setLoading(false);
                  })
                  .catch((err) => {
                    console.error("Error fetching medications", err);
                    setLoading(false);
                  });
              });

              setIsConfirmLogModalOpen(false);
            }}
          />
          <div className={styles.medsWrap}>
            <div className={styles.logsContainer}>
              {filteredMedications.length === 0 ? (
                <div className={styles.emptyMessage}>No medications found.</div>
              ) : (
                filteredMedications.map((medication, index) => (
                  <div key={index} className={styles.logMeds}>
                    <div className={styles.logName}>
                      <strong>{medication.name}</strong>
                    </div>
                    <div className={styles.circle}></div> {/* Circle */}
                    <div className={styles.logDosage}>
                      {medication.dosage.toString() +
                        " " +
                        medication.measurement}
                    </div>
                    <div className={styles.logLastTake}>
                      <strong>Last taken</strong>
                      <br />
                      {medication.last_taken ? (
                        <>{`${timestampToString(medication.last_taken, "MMDDYYYY")} @ ${timestampToString(medication.last_taken, "HH:MM XX")}`}</>
                      ) : (
                        <>Not yet taken.</>
                      )}
                      {/* Format timestamp */}
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
                            name: medication.name,
                          },
                        }}
                      />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MedicationsView;
