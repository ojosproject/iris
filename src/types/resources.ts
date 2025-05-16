/**
 * File:     types/resources.ts
 * Purpose:  Types for the Resources tool.
 * Authors:  Ojos Project & Iris contributors
 * License:  GNU General Public License v3.0
 */
export type Resource = {
  label: string;
  description: string;
  url: string;
  organization: string;
  category: string;
  last_updated: number; // Unix timestamp
};
