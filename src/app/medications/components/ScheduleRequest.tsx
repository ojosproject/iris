// ScheduleMedicationModal for the scheduling medication
import React from "react";
import styles from "./ScheduleRequest.module.css";
import { use, useState } from "react";
import { Medication } from "../types";

interface NextScheduleForm {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (newMedication: Medication) => void;
}

const ScheduleForm: React.FC<NextScheduleForm> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [medicationFrequency, setMedicationFrequency] = useState("");
  const [medicationStartDate, setMedicationStartDate] = useState<
    string | undefined
  >(undefined);
  const [medicationEndDate, setMedicationEndDate] = useState<
    string | undefined
  >(undefined);

  const handleSubmit = () => {
    const newMedication: Medication = {
      start_date: medicationStartDate
        ? Date.parse(medicationStartDate)
        : undefined,
      end_date: medicationEndDate ? Date.parse(medicationEndDate) : undefined,
      frequency: medicationFrequency || undefined,
    };
    onClose();
  };

  return (
    <div>
      {/* Modal content */}
      <button onClick={onClose}>Close</button>
    </div>
  );
};

export default ScheduleForm;
