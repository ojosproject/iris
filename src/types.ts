// types.ts
// Ojos Project
//
// Rust structs converted into TypeScript types.
// Original structs can be found in src-tauri/src/structs.rs.

export type Medication = {
  name: string;
  brand: string;
  dosage: number; // float
  frequency: number; // float, 0.0 if it's "as needed"
  supply?: number; // float
  first_added?: number; // Epoch seconds
  last_taken?: number; // Epoch seconds
  upcoming_dose?: number; // Epoch seconds
  schedule?: string; // comma separated values, hours in 24-hr format (e.g., 0,6,12,18 to represent 12am, 6am, 12pm, 6pm)
  measurement: string;
};

export type User = {
  id: string;
  full_name: string;
  type_of: string;
  credential: string;
};

export type MedicationLog = {
  timestamp: number; // float
  medication_name: string;
  given_dose: number; // float
  comment?: string;
};

export type Config = {
  resources_last_call: number; // integer
  onboarding_completed: boolean;
};

export type Resource = {
  label: string;
  description: string;
  url: string;
  organization: string;
  category: "FINANCIAL" | "LEGAL";
  last_updated: number; // Unix timestamp
};

// Extra care instructions provided by the caregivers for the nurses.
export type CareInstruction = {
  id: string;
  title: string;
  content: string;
  frequency: string;
  added_by: string;
  last_updated: number;
};
