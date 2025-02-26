"use client";
import React, { useState, useEffect } from "react";
import styles from "./page.module.css";
import NewMedicationModal from "./components/NewMedicationModal";
import { Medication } from "./types";
import { invoke } from "@tauri-apps/api/core";
import BackButton from "../core/components/BackButton";
import Button from "../core/components/Button";
import ConfirmLogModal from "./components/ConfirmLogModal";
import { timestampToString } from "../core/helper";
import useKeyPress from "../accessibility/keyboard_nav";
import { useRouter } from "next/navigation";

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
  const [isNewMedModalOpen, setIsNewMedModelOpen] = useState(false);
  const [isConfirmLogModalOpen, setIsConfirmLogModalOpen] = useState(false);
  const [medications, setMedications] = useState<Medication[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useKeyPress("Escape", () => {
    router.back();
  });

  useKeyPress("Enter", () => {
    router.back();
  });

  const handleAddMedicationClick = () => {
    setIsNewMedModelOpen(true);
  };
  const handleNewMedModelClose = () => {
    setIsNewMedModelOpen(false);
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
      (log) => log.name.toLowerCase() === newMedication.name.toLowerCase(),
    );

    if (exists) {
      return;
    }

    invoke("create_medication", {
      name: newMedication.name,
      dosage: newMedication.dosage,
      frequency: newMedication.frequency,
      supply: newMedication.supply,
      measurement: newMedication.measurement,
      nurse_id: newMedication.nurse_id,
    });

    setMedications([...medications, newMedication]);
    setIsNewMedModelOpen(false);
  };


  return (
    <>
      <BackButton />
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
            onClick={handleAddMedicationClick}
          />
        </div>
        <NewMedicationModal
          isOpen={isNewMedModalOpen}
          onClose={handleNewMedModelClose}
          onSubmit={handleNewMedModelSubmit}
        />
        <ConfirmLogModal
          isOpen={isConfirmLogModalOpen}
          onClose={() => setIsConfirmLogModalOpen(false)}
          medication={selectedMedication}
          onConfirm={() => {
            invoke("log_medication", {
              medication: selectedMedication?.name,
              comments: null,
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
    </>
  );
};

export default MedicationsView;
