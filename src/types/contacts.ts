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
