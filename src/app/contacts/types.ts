// All contacts associated with the user.
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
