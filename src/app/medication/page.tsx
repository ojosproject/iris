"use client";
import React, { useState, useEffect } from "react";
import styles from "./LogTab.module.css";
import MedicationModal from "./components/newMed";
import Link from "next/link";
import MainMenuButton from "./components/mainMenuButton";
// * Added MedicationLog type to reflect how data will return from the backend
import { Medication, MedicationLog } from "@/types";
import { invoke } from "@tauri-apps/api/core";

// todo:
// - Implement invoke() to get all medications from the backend
// - Implement invoke() for the Add Medication button
// - Implement invoke() for the View button
// - Figure out how to work the Log button

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
  };
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
      alert("Medication already exists!");
      return;
    } else if (newMedication.dosage <= 0) {
      alert("Please provide valid medication details.");
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
                    <strong>Last Taken </strong>
                    <br />
                    {new Date(
                      log.last_taken ? log.last_taken * 1000 : "N/A",
                    ).toLocaleString()}{" "}
                    {/* Format timestamp */}
                  </div>
                  <div key={log.name} className={styles.logButtons}>
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
                          medication_name: log.name,
                          given_dose: log.dosage,
                          given_measurement: log.measurement,
                          last_taken: log.last_taken,
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
