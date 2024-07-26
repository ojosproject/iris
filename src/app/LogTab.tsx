import React, { useState } from 'react'

interface MedicationLog {
  medName: string;
  medDosage: string;
  medFrequency: string;
}

const LogTab: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [medicationLogs, setMedicationLogs] = useState<MedicationLog[]>([
    //Example, up to changes
    { medName: "Med #1", medDosage: "10mg", medFrequency: "1/day" },
    { medName: "Med #2", medDosage: "20mg", medFrequency: "1/evening" },
  ]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const filteredLogs = medicationLogs.filter(log =>
    log.medName.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div>
      <input
        type="text"
        placeholder='Search Medication...'
        value={searchQuery}
        onChange={handleSearchChange}
        style={{ marginBottom: '10px', padding: '5px', width: '100%' }}
      />
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {filteredLogs.map((log, index) => (
          <div key={index} style={{ width: '48%', margin: '1%', padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }}>
            <div>Med #{index + 1}: Name - {log.medName}</div>
            <div>Med Dosage - {log.medDosage}</div>
            <div>Med Frequency - {log.medFrequency}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default LogTab;
