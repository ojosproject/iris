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
  frequency: string;
  added_by: string;
  last_updated: number;
};
