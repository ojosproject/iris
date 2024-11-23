import { PatientReportedOutcome } from "./types";

type ChartData = {
  [question: string]: [response: number, recorded_date: Date][];
};

export function sortChartData(data: PatientReportedOutcome[]): ChartData {
  let questions: ChartData = {};

  data.forEach((pro) => {
    if (!Object.keys(questions).includes(pro.question)) {
      questions[pro.question] = [
        [pro.response, new Date(pro.recorded_date * 1000)],
      ];
    } else {
      questions[pro.question].push([
        pro.response,
        new Date(pro.recorded_date * 1000),
      ]);
    }
  });

  return questions;
}
