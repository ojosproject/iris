"use client";
import React, { useState, useEffect } from "react";
import styles from "./page.module.css";
import MedicationModal from "./components/newMed";
import { Medication } from "./types";
import { invoke } from "@tauri-apps/api/core";
import BackButton from "../core/components/BackButton";
import Button from "../core/components/Button";
import ConfirmationModal from "./components/logConfirmation";
import { timestampToString } from "../core/helper";

const LogTab = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };
  const [selectedMedication, setSelectedMedication] =
    useState<Medication | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const medicationSelect = (log: Medication) => {
    setSelectedMedication(log);
    setIsConfirmationModelOpen(true);
  };
  const [isConfirmationModelOpen, setIsConfirmationModelOpen] = useState(false);
  const [medications, setMedications] = useState<Medication[]>([]);
  const [loading, setLoading] = useState(true);
  const handleAddMedication = () => {
    setIsModalOpen(true);
  };

  // const [medicationLogs, setMedicationLogs] = useState<MedicationLog[]>([]);

  const handleModalClose = () => {
    setIsModalOpen(false);
  };
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

  const filteredLogs = medications.filter((log) =>
    log.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // Function to handle the submission of new medication
  const handleModalSubmit = async (newMedication: Medication) => {
    const exists = medications.some(
      (log) => log.name.toLowerCase() === newMedication.name.toLowerCase(),
    );

    if (exists) {
      return;
    }

    invoke("create_medication", {
      name: newMedication.name,
      brand: newMedication.brand,
      dosage: newMedication.dosage,
      frequency: newMedication.frequency,
      supply: newMedication.supply,
      measurement: newMedication.measurement,
      nurse_id: newMedication.nurse_id,
    });

    setMedications([...medications, newMedication]);
    setIsModalOpen(false);
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
            onClick={handleAddMedication}
          />
        </div>
        <MedicationModal
          isOpen={isModalOpen}
          onClose={handleModalClose}
          onSubmit={handleModalSubmit}
        />
        <ConfirmationModal
          isOpen={isConfirmationModelOpen}
          onClose={() => setIsConfirmationModelOpen(false)}
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

            setIsConfirmationModelOpen(false);
          }}
        />
        <div className={styles.medsWrap}>
          <div className={styles.logsContainer}>
            {medications.length === 0 ? (
              <div className={styles.emptyMessage}>No medications found.</div>
            ) : (
              filteredLogs.map((log, index) => (
                <div key={index} className={styles.logMeds}>
                  <div className={styles.logName}>
                    <strong>{log.name}</strong>
                  </div>
                  <div className={styles.circle}></div> {/* Circle */}
                  <div className={styles.logDosage}>
                    {log.dosage.toString() + " " + log.measurement}
                  </div>
                  <div className={styles.logLastTake}>
                    <strong>Last taken</strong>
                    <br />
                    {log.last_taken ? (
                      <>{`${timestampToString(log.last_taken, "MMDDYYYY")} @ ${timestampToString(log.last_taken, "HH:MM XX")}`}</>
                    ) : (
                      <>Not yet taken.</>
                    )}
                    {/* Format timestamp */}
                  </div>
                  <div key={log.name} className={styles.logButtons}>
                    <Button
                      type="PRIMARY"
                      label="Log"
                      onClick={() => medicationSelect(log)}
                    />
                    <Button
                      type="SECONDARY"
                      label="View"
                      link={{
                        pathname: "/medications/view/",
                        query: {
                          name: log.name,
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

export default LogTab;
