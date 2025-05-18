/**
 * File:     pro.ts
 * Purpose:  Types for the Patient Reported Outcomes tool.
 * Authors:  Ojos Project & Iris contributors
 * License:  GNU General Public License v3.0
 */
export type PatientReportedOutcome = {
  id: string;
  recorded_date: number;
  question: string;
  response: number;
};

export type ProQuestion = {
  id: string;
  category: string;
  question: string;
  question_type: string;
  lowest_ranking?: number;
  highest_ranking?: number;
  lowest_label?: string;
  highest_label?: string;
};
