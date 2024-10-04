"use client";
import React, { useState } from "react";
import styles from "./LogTab.module.css";
import ConfirmationModal from "./components/logConfirmation";
import MedicationModal from "./components/newMed";
import Link from "next/link";
import MainMenuButton from "./components/mainMenuButton";
// * Added MedicationLog type to reflect how data will return from the backend
import { MedicationLog } from "@/types";

const LogTab = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };
  const [selectedMedication, setSelectedMedication] =
    useState<MedicationLog | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const medicationSelect = (log: MedicationLog) => {
    setSelectedMedication(log);
    setIsConfirmationModalOpen(true);
  };

  const [medicationLogs, setMedicationLogs] = useState<MedicationLog[]>([
    //TODO: keep frequency but change to "x amount / hour"
    {
      medication_name: "Med #1",
      given_dose: 10,
      measurement: "mg",
      timestamp: 0, // Epoch timestamp
    },
    {
      medication_name: "Med #2",
      given_dose: 20,
      measurement: "mg",
      timestamp: 0,
    },
    {
      medication_name: "Med #3",
      given_dose: 40,
      measurement: "mg",
      timestamp: 0,
    },
    {
      medication_name: "Med #4",
      given_dose: 70,
      measurement: "mg",
      timestamp: 0,
    },
  ]);

  // Modal used for the log button
  const confirmSelection = () => {
    if (selectedMedication) {
      alert(
        `${selectedMedication.medication_name} is selected, logging now...`,
      );
      setSelectedMedication(null);
      setIsConfirmationModalOpen(false);
    }
  };

  const filteredLogs = medicationLogs.filter((log) =>
    log.medication_name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleAddMedication = () => {
    setIsModalOpen(true);
  };

  // Function to handle the submission of new medication
  // TODO: Only adding medication to the list for now, need to implement backend
  const handleModalSubmit = (newMedication: MedicationLog) => {
    const exists = medicationLogs.some(
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

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  //TODO: Add back to menu button
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
            {filteredLogs.map((log, index) => (
              <div key={index} className={styles.logMeds}>
                <div className={styles.logName}>
                  <strong>{log.medication_name}</strong>
                </div>
                <div className={styles.circle}></div> {/* Circle */}
                <div className={styles.logDosage}>
                  {log.given_dose.toString() + log.measurement}
                </div>
                <div className={styles.logLastTake}>
                  <strong>Last Taken </strong>
                  <br />
                  {log.timestamp}
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
                        last_taken: log.timestamp,
                      },
                    }}
                  >
                    <button className={styles.logItem}>View</button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Confirmation Taken out furture pull request */}
        {/* 
      <ConfirmationModal
        isOpen={isConfirmationModalOpen}
        onClose={() => setIsConfirmationModalOpen(false)}
        onConfirm={confirmSelection}
        medicationName={selectedMedication}
      />
      */}
      </div>
    </>
  );
};

export default LogTab;
