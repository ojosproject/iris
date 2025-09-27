/**
 * File:     types/settings.ts
 * Purpose:  Types for the Settings tool.
 * Authors:  Ojos Project & Iris contributors
 * License:  GNU General Public License v3.0
 */
export type Config = {
  onboarding_completed: boolean;
  appearance: "light" | "dark" | null;
};

export type DataPackReceipt = {
  resources_count?: number;
  pro_count?: number;
  contacts_count?: number;
};
