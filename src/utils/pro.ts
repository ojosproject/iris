import { PatientReportedOutcome, ProQuestion } from "@/types/pro";
import { connectUserDB } from "./database";
import { stamp } from "./stamp";

type ProTuple = [string, number];

export async function addPros(pros: ProTuple[]) {
  const conn = await connectUserDB();

  pros.forEach(async (pair) => {
    const [timestamp, uuid] = await stamp();

    await conn.execute(
      "INSERT INTO patient_recorded_outcome (id, recorded_date, question, response) VALUES ($1, $2, $3, $4)",
      [uuid, timestamp, pair[0], pair[1]],
    );
  });
}

export async function getPros(): Promise<PatientReportedOutcome[]> {
  const conn = await connectUserDB();
  return await conn.select("SELECT * FROM patient_recorded_outcome");
}

export async function getProQuestions(): Promise<ProQuestion[]> {
  const conn = await connectUserDB();
  return await conn.select("SELECT * FROM pro_question");
}
