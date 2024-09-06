import React, { useState } from "react";
import "./LogTab.css";
import ConfirmationModal from "./LogConfirmation";
// * Added MedicationLog type to reflect how data will return from the backend
// Idk if we need frequency. I'll check in soon.
import { MedicationLog } from "@/types";

const LogTab: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [medicationLogs, setMedicationLogs] = useState<MedicationLog[]>([
    //TODO: Place holder and need to link with the backend, allow manual input of medication

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

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const [selectedMedication, setSelectedMedication] =
    useState<MedicationLog | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const medicationSelect = (log: MedicationLog) => {
    setSelectedMedication(log);
    setIsModalOpen(true);
  };

  const medicationView = (log: MedicationLog) => {
    //TODO: add a way to use the med view log
  };

  const closeModal = () => {
    setSelectedMedication(null);
    setIsModalOpen(false);
  };

  const confirmSelection = () => {
    if (selectedMedication) {
      alert(
        `${selectedMedication.medication_name} is selected, logging now...`,
      );
      setSelectedMedication(null);
      setIsModalOpen(false);
    }
  };

  const filteredLogs = medicationLogs.filter((log) =>
    log.medication_name.toLowerCase().includes(searchQuery.toLowerCase()),
  );
  //TODO: fix search display
  return (
    <div className="container">
      <h1 className="header">Your Medication</h1>
      <div className="searchBarContainer">
        <input
          type="text"
          placeholder="Search Medication..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="searchInput"
        />
      </div>
      <div className="medsWrap">
        <div className="logsContainer">
          {filteredLogs.map((log, index) => (
            <div key={index} className="logMeds">
              <div className="logName">
                <strong>{log.medication_name}</strong>
              </div>
              <div className="circle"></div> {/* Circle */}
              <div className="logDosage">
                {log.given_dose.toString() + log.measurement}
              </div>
              {/*<div className="logFrequency">{log.medFrequency}</div>*/}
              <div className="logLastTake">
                <strong>Last Taken </strong>
                <br />
                {log.timestamp}
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  medicationSelect(log);
                }}
                className="logItem"
              >
                Log
              </button>
              //TODO: add view individual buttons
              {/*
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    medicationSelect(log);
                  }}
                  className="logItem"
                >
                  View
                </button>
                 */}
            </div>
          ))}
        </div>
      </div>
      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onConfirm={confirmSelection}
        medicationName={selectedMedication}
      />
    </div>

    /* comment for branch */
  );
};

export default LogTab;
