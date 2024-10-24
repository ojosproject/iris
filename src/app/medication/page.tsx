"use client";
import React, { useState, useEffect } from "react";
import styles from "./LogTab.module.css";
import MedicationModal from "./components/newMed";
import Link from "next/link";
import MainMenuButton from "./components/mainMenuButton";
// * Added MedicationLog type to reflect how data will return from the backend
import { MedicationLog } from "@/types";
import { invoke } from "@tauri-apps/api/core";

const LogTab = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };
  const [selectedMedication, setSelectedMedication] =
    useState<MedicationLog | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const medicationSelect = (log: MedicationLog) => {
    setSelectedMedication(log);
  };
  const [medications, setMedications] = useState<MedicationLog[]>([]);
  const [loading, setLoading] = useState(true);
  const handleAddMedication = () => {
    setIsModalOpen(true);
  };

  const [medicationLogs, setMedicationLogs] = useState<MedicationLog[]>([]);

  const handleModalClose = () => {
    setIsModalOpen(false);
  };
  useEffect(() => {
    invoke("get_medications")
      .then((m) => {
        setMedications(m as MedicationLog[]);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching medications", err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (!loading && medications.length === 0) {
      setMedicationLogs([
        {
          medication_name: "Med #1",
          given_dose: 10,
          measurement: "mg",
          timestamp: 1724166000,
        },
      ]);
    }
  }, [loading, medications]);

  if (loading) {
    return <div>Loading...</div>;
  }

  const filteredLogs = (
    medications.length > 0 ? medications : medicationLogs
  ).filter((log) =>
    log.medication_name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // Function to handle the submission of new medication
  // TODO: Only adding medication to the list for now, need connection to back
  const handleModalSubmit = async (newMedication: MedicationLog) => {
    const exists = medications.some(
      (log) =>
        log.medication_name.toLowerCase() ===
        newMedication.medication_name.toLowerCase(),
    );

    if (exists) {
      alert("Medication already exists!");
      return;
    } else if (newMedication.given_dose <= 0) {
      alert("Please provide valid medication details.");
      return;
    }

    setMedicationLogs([...medicationLogs, newMedication]);
    setIsModalOpen(false);
  };

  // TODO: Currently on PR, there is no way to amend medication to backend
  {
    /* 
  const handleModalSubmit = (newMedication: MedicationLog) => {
    const exists = medications.some(
      (log) =>
        log.medication_name.toLowerCase() ===
        newMedication.medication_name.toLowerCase(),
    );

    if (exists) {
      alert("Medication already exists!");
      return;
    } else if (newMedication.given_dose <= 0) {
      alert("Please provide valid medication details.");
      return;
    }

    // If medication is valid, proceed to call the backend to add it
    invoke("add_medication", { newMedication })
      .then(() => {
        setMedications((prevMeds) => [...prevMeds, newMedication]);
        setSearchQuery("");
        setIsModalOpen(false);
      })
      .catch((err) => {
        console.error("Error adding medication", err);
      });
      */
  }

  return (
    <>
      <MainMenuButton />
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
          <button
            onClick={handleAddMedication}
            className={styles.addMedicationButton}
          >
            Add Medication
          </button>
        </div>
        <MedicationModal
          isOpen={isModalOpen}
          onClose={handleModalClose}
          onSubmit={handleModalSubmit}
        />
        <div className={styles.medsWrap}>
          <div className={styles.logsContainer}>
            {medicationLogs.length === 0 ? (
              <div className={styles.emptyMessage}>No medications found.</div>
            ) : (
              filteredLogs.map((log, index) => (
                <div key={index} className={styles.logMeds}>
                  <div className={styles.logName}>
                    <strong>{log.medication_name}</strong>
                  </div>
                  <div className={styles.circle}></div> {/* Circle */}
                  <div className={styles.logDosage}>
                    {log.given_dose.toString() + " " + log.measurement}
                  </div>
                  <div className={styles.logLastTake}>
                    <strong>Last Taken </strong>
                    <br />
                    {new Date(log.timestamp * 1000).toLocaleString()}{" "}
                    {/* Format timestamp */}
                  </div>
                  <div key={log.medication_name} className={styles.logButtons}>
                    <button
                      onClick={() => medicationSelect(log)}
                      className={styles.logItem}
                    >
                      Log
                    </button>
                    <Link
                      href={{
                        pathname: "/medication/medview",
                        query: {
                          medication_name: log.medication_name,
                          given_dose: log.given_dose,
                          given_measurement: log.measurement,
                          last_taken: log.timestamp,
                        },
                      }}
                    >
                      <button className={styles.logItem}>View</button>
                    </Link>
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
