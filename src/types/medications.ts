/**
 * File:     types/medications.ts
 * Purpose:  The types for the Medications tool.
 * Authors:  Ojos Project & Iris contributors
 * License:  GNU General Public License v3.0
 */
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
  last_taken?: number;
  icon: string;
};

export type MedicationLog = {
  id: string;
  timestamp: number;
  medication_id: string;
  strength: number;
  units: string;
  comments: string;
};
