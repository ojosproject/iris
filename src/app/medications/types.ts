export type Medication = {
  name: string;
  brand?: string;
  dosage: number; // float
  frequency: number; // float, 0.0 if it's "as needed"
  supply: number; // float
  total_prescribed: number; // float
  first_added: number; // Epoch seconds
  last_taken?: number; // Epoch seconds
  upcoming_dose?: number; // Epoch seconds
  schedule?: string; // comma separated values, hours in 24-hr format (e.g., 0,6,12,18 to represent 12am, 6am, 12pm, 6pm)
  measurement: string;
  nurse_id: string;
};

export type MedicationLog = {
  timestamp: number; // float
  medication_name: string;
  given_dose: number; // float
  measurement: string;
  comment?: string;
};
