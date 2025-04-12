// types.ts
// Ojos Project
//
// Rust structs converted into TypeScript types.
// Original structs can be found in src-tauri/src/structs.rs.

export type User = {
  id: string;
  full_name: string;
  type_of: "PATIENT" | "NURSE";
  phone_number?: number;
  email?: string;
};

type ConfigContact = {
  method: "SMS";
  value: string;
};

export type Config = {
  resources_last_call: number; // integer
  onboarding_completed: boolean;
  contacts: ConfigContact[];
  pro_questions: string[];
};
