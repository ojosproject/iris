import { PatientReportedOutcome } from "./types";

type ChartData = {
  [question: string]: [response: number, recorded_date: Date][];
};

export function sortChartData(data: PatientReportedOutcome[]): ChartData {
  let questions: ChartData = {};

  data.forEach((pro) => {
    console.log("pro data in helper: ", pro);
    console.log("pro data date in helper: ", pro.recorded_date);
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

  for (const question in questions) {
    questions[question].sort((a, b) => a[1].getTime() - b[1].getTime());
  }

  return questions;
}

