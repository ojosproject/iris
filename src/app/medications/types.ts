export type Medication = {
  id: string;
  name: string;
  generic_name?: string;
  dosage_type: string;
  strength: number;
  units: string;
  quantity: number;
  created_at: number;
  updated_at: number;
  start_date?: number;
  end_date?: number;
  expiration_date?: number;
  frequency?: string;
  notes?: string;
};

export type MedicationLog = {
  id: string;
  timestamp: number;
  medication_id: string;
  strength: number;
  units: string;
  comments?: string;
};
