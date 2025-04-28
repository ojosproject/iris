// types.ts
// Ojos Project
//
// Rust structs converted into TypeScript types.
// Original structs can be found in src-tauri/src/structs.rs.

export type Config = {
  onboarding_completed: boolean;
};

export type DataPackReceipt = {
  resources_count?: number;
  pro_count?: number;
  contacts_count?: number;
};
