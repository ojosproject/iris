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
