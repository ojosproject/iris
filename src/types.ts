// types.ts
// Ojos Project
// 
// Rust structs converted into TypeScript types.
// Original structs can be found in src-tauri/src/structs.rs.

export type Medication = {
    name: string,
    brand: string,
    dosage: number, // float
    frequency?: string,
    supply?: number, // float
    first_added?: number, // Epoch seconds
    last_taken?: number, // Epoch seconds
    measurement: string,
}

export type User = {
    id: string,
    full_name: string,
    type_of: string,
    credential: string
}

export type MedicationLog = {
    timestamp: number, // float
    medication_name: string,
    given_dose: number, // float
    comment?: string
}
