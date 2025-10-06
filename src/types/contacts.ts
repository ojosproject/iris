/**
 * File:     types/contacts.ts
 * Purpose:  The types for the Contact tool.
 * Authors:  Ojos Project & Iris contributors
 * License:  GNU General Public License v3.0
 */
export type Contact = {
  id: string;
  name: string;
  phone_number?: string;
  company?: string;
  email?: string;
  contact_type: "PATIENT" | "CAREGIVER";
  enabled_relay: boolean;
  last_updated: number;
};

export const CONTACT_SCHEMA = `CREATE TABLE IF NOT EXISTS contacts (
    id TEXT NOT NULL PRIMARY KEY,
    name TEXT NOT NULL,
    phone_number TEXT,
    company TEXT,
    email TEXT,
    contact_type TEXT NOT NULL,
    enabled_relay INTEGER NOT NULL,
    last_updated INTEGER NOT NULL
) STRICT;`;
