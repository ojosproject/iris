"use client";
import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useNavigate,
} from "react-router-dom";
import "./LogTab.css";
import ConfirmationModal from "./components/LogConfirmation";
import MedicationModal from "./components/NewMed";
import MedicineView from "../medview/page";
import NavigationProvider from "./components/navigation";
// * Added MedicationLog type to reflect how data will return from the backend
// Idk if we need frequency. I'll check in soon.
import { MedicationLog } from "@/types";

interface LogTabProps {
  navigate: (page: string, data?: any) => void;
}

const LogTab: React.FC<LogTabProps> = ({ navigate }) => {
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
      //interval: "_x per day",
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

  // navigation to med view
  const handleViewClick = (log: MedicationLog) => {
    console.log("Navigating to medView with:", log);
    navigate("medView", log);
  };

  return (
    <div className="container">
      <h1 className="header">Your Medications</h1>
      <div className="searchBarContainer">
        <input
          type="text"
          placeholder="Search Medication..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="searchInput"
        />
        <button onClick={handleAddMedication} className="addMedicationButton">
          Add Medication
        </button>
        <MedicationModal
          isOpen={isModalOpen}
          onClose={handleModalClose}
          onSubmit={handleModalSubmit}
        />
      </div>
      <div className="medsWrap">
        {/* TODO: Fix the display of medication in odd amount */}
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
              <div key={log.medication_name} className="logButtons">
                <button
                  onClick={() => medicationSelect(log)}
                  className="logItem"
                >
                  Log
                </button>
                <button
                  onClick={() => handleViewClick(log)}
                  className="logItem"
                >
                  View
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <ConfirmationModal
        isOpen={isConfirmationModalOpen}
        onClose={() => setIsConfirmationModalOpen(false)}
        onConfirm={confirmSelection}
        medicationName={selectedMedication}
      />
    </div>

    /* comment for branch */
  );
};

export default LogTab;
