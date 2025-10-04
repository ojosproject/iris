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

export const MEDICATION_SCHEMA = `CREATE TABLE IF NOT EXISTS medication_log (
    id TEXT NOT NULL PRIMARY KEY,
    timestamp INTEGER NOT NULL,
    medication_id TEXT NOT NULL,
    strength REAL NOT NULL,
    units TEXT NOT NULL,
    comments TEXT
) STRICT;

CREATE TABLE IF NOT EXISTS medication (
    id TEXT NOT NULL PRIMARY KEY,
    name TEXT NOT NULL,
    generic_name TEXT,
    dosage_type TEXT NOT NULL,
    strength REAL NOT NULL,
    units TEXT NOT NULL,
    quantity REAL NOT NULL,
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL,
    start_date INTEGER,
    end_date INTEGER,
    expiration_date INTEGER,
    frequency TEXT,
    notes TEXT,
    last_taken INTEGER,
    icon TEXT
) STRICT;`;
