import { Medication, MedicationLog } from "@/types/medications";
import { connectUserDB } from "./database";
import { stamp, unix_timestamp } from "./stamp";

export async function createMedication(
  name: string,
  genericName: string | undefined,
  dosageType: string,
  strength: number,
  units: string,
  quantity: number,
  startDate: number | undefined,
  endDate: number | undefined,
  expirationDate: number | undefined,
  frequency: string | undefined,
  notes: string | undefined,
  icon: string,
): Promise<Medication> {
  const conn = await connectUserDB();
  const [timestamp, uuid] = await stamp();

  const medication: Medication = {
    id: uuid,
    name,
    generic_name: genericName,
    dosage_type: dosageType,
    strength,
    units,
    quantity,
    created_at: timestamp,
    updated_at: timestamp,
    start_date: startDate,
    end_date: endDate,
    expiration_date: expirationDate,
    frequency,
    notes,
    last_taken: undefined,
    icon,
  };

  await conn.execute(
    "INSERT INTO medication (id, name, generic_name, dosage_type, strength, units, quantity, created_at, updated_at, start_date, end_date, expiration_date, frequency, notes, icon) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)",
    [
      medication.id,
      medication.name,
      medication.generic_name,
      medication.dosage_type,
      medication.strength,
      medication.units,
      medication.quantity,
      medication.created_at,
      medication.updated_at,
      medication.start_date,
      medication.end_date,
      medication.expiration_date,
      medication.frequency,
      medication.notes,
      medication.icon,
    ],
  );

  return medication;
}

export async function getMedications(
  id: string | "all",
): Promise<Medication[]> {
  const conn = await connectUserDB();

  if (id !== "all") {
    return await conn.select("SELECT * FROM medication WHERE id=$1", [id]);
  } else {
    return await conn.select("SELECT * FROM medication");
  }
}

export async function deleteMedication(id: string) {
  const conn = await connectUserDB();
  await conn.execute("DELETE medication WHERE id=$1", [id]);
}

export async function setMedicationIcon(
  id: string,
  value: string,
): Promise<Medication> {
  const conn = await connectUserDB();
  const timestamp = await unix_timestamp();

  await conn.execute(
    "UPDATE medication SET icon=$1, updated_at=$2 WHERE id=$3",
    [value, timestamp, id],
  );

  return (await getMedications(id))[0];
}

export async function setMedicationQuantity(
  id: string,
  value: number,
): Promise<Medication> {
  const conn = await connectUserDB();
  const timestamp = await unix_timestamp();

  await conn.execute(
    "UPDATE medication SET quantity=$1, updated_at=$2 WHERE id=$3",
    [value, timestamp, id],
  );

  return (await getMedications(id))[0];
}

export async function logMedication(
  id: string,
  strength: number,
  units: string,
  comments: string,
): Promise<MedicationLog> {
  const conn = await connectUserDB();
  const [timestamp, uuid] = await stamp();

  const log: MedicationLog = {
    id: uuid,
    timestamp,
    medication_id: id,
    strength,
    units,
    comments,
  };

  await conn.execute(
    "INSERT INTO medication_log(id, timestamp, medication_id, strength, units, comments) VALUES ($1, $2, $3, $4, $5, $6)",
    [
      log.id,
      log.timestamp,
      log.medication_id,
      log.strength,
      log.units,
      log.comments,
    ],
  );
  await conn.execute(
    "UPDATE medication SET last_taken=$1, updated_at=$2 WHERE id=$3",
    [log.timestamp, log.timestamp, log.medication_id],
  );

  return log;
}

export async function getMedicationLogs(
  medicationId: string | "all",
): Promise<MedicationLog[]> {
  const conn = await connectUserDB();

  if (medicationId == "all") {
    return conn.select("SELECT * FROM medication_log ORDER BY timestamp DESC");
  } else {
    return conn.select(
      "SELECT * FROM medication_log WHERE medication_id=$1 ORDER BY timestamp DESC",
      [medicationId],
    );
  }
}
