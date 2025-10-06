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

export const RESOURCE_SCHEMA = `CREATE TABLE IF NOT EXISTS resource (
    label TEXT NOT NULL,
    description TEXT NOT NULL,
    url TEXT NOT NULL PRIMARY KEY,
    organization TEXT NOT NULL,
    category TEXT NOT NULL,
    last_updated INTEGER NOT NULL
) STRICT;`;
