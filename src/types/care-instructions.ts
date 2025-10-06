/**
 * File:     care-instructions.ts
 * Purpose:  The Care Instructions type.
 * Authors:  Ojos Project & Iris contributors
 * License:  GNU General Public License v3.0
 */
export type CareInstruction = {
  id: string;
  title: string;
  content: string;
  last_updated: number;
};

export const CARE_INSTRUCTIONS_SCHEMA = `CREATE TABLE IF NOT EXISTS care_instruction (
    id TEXT NOT NULL PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    last_updated INTEGER NOT NULL
) STRICT;`;
