import React, { useState } from 'react'
import './LogTab.css';
import ConfirmationModal from './LogConfirmation';


//TODO: change to reflect medication information
interface MedicationLog {
  medName: string;
  medDosage: string;
  medFrequency: string;
  lastTaken: string;
}

const LogTab: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [medicationLogs, setMedicationLogs] = useState<MedicationLog[]>([
    //TODO: Place holder and need to link with the backend
    { medName: "Med #1", medDosage: "10mg", medFrequency: "1/day", lastTaken: 'mm/dd/yyyy @ hh:mm' },
    { medName: "Med #2", medDosage: "20mg", medFrequency: "1/evening", lastTaken: 'mm/dd/yyyy @ hh:mm' },
    { medName: "Med #3", medDosage: "40mg", medFrequency: "1/mornign", lastTaken: 'mm/dd/yyyy @ hh:mm' },
    { medName: "Med #4", medDosage: "70mg", medFrequency: "1/night", lastTaken: 'mm/dd/yyyy @ hh:mm' },
  ]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const [selectedMedication, setSelectedMedication] = useState<MedicationLog | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const medicationSelect = (log: MedicationLog) => {
    setSelectedMedication(log);
    setIsModalOpen(true);
  };

  const medicationView = (log: MedicationLog) => {
    //TODO: add a way to use the med view log
  }

  const closeModal = () => {
    setSelectedMedication(null);
    setIsModalOpen(false);
  };

  const confirmSelection = () => {
    if (selectedMedication) {
      alert(`${selectedMedication.medName} is selected, logging now...`);
      setSelectedMedication(null);
      setIsModalOpen(false);
    }
  };

  const filteredLogs = medicationLogs.filter(log =>
    log.medName.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="container">
      <h1 className="header">Your Medication</h1>
      <input
        type="text"
        placeholder="Search Medication..."
        value={searchQuery}
        onChange={handleSearchChange}
        className="searchInput"
      />
      <div className='medsWrap'>
        <div className="logsContainer">
          {filteredLogs.map((log, index) => (
            <div
              key={index}
              className="logMeds"
            >
              <div className="logName">Name - {log.medName}</div>
              <div className="logDosage">Med Dosage - {log.medDosage}</div>
              <div className="logFrequency">Med Frequency - {log.medFrequency}</div>
              <div className="logLastTake">Last Taken - {log.lastTaken}</div>
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
  );
}

export default LogTab;
