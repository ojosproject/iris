import { CareInstruction } from "@/types/care-instructions";
import { connectUserDB } from "./database";
import { stamp, unix_timestamp } from "./stamp";

export async function getCareInstructions(): Promise<CareInstruction[]> {
  const conn = await connectUserDB();
  return await conn.select(
    "SELECT * FROM care_instruction ORDER BY last_updated DESC",
  );
}

export async function getCareInstruction(
  id: string,
): Promise<CareInstruction | undefined> {
  const conn = await connectUserDB();
  const instructions: CareInstruction[] = await conn.select(
    "SELECT * FROM care_instruction ORDER BY last_updated DESC",
  );

  return instructions.find((instruction) => instruction.id === id);
}

export async function createCareInstruction(
  title: string,
  content: string,
): Promise<CareInstruction> {
  const conn = await connectUserDB();
  const [timestamp, uuid] = await stamp();

  const instruction: CareInstruction = {
    id: uuid,
    title,
    content,
    last_updated: timestamp,
  };

  await conn.execute(
    "INSERT INTO care_instruction(id, title, content, last_updated) VALUES ($1, $2, $3, $4)",
    [
      instruction.id,
      instruction.title,
      instruction.content,
      instruction.last_updated,
    ],
  );

  return instruction;
}

export async function updateCareInstruction(
  id: string,
  title: string,
  content: string,
): Promise<CareInstruction> {
  const conn = await connectUserDB();
  const ts = await unix_timestamp();

  const instruction: CareInstruction = {
    id,
    title,
    content,
    last_updated: ts,
  };

  await conn.execute(
    "UPDATE care_instruction SET title=$2, content=$3, last_updated=$4 WHERE id=$1",
    [
      instruction.id,
      instruction.title,
      instruction.content,
      instruction.last_updated,
    ],
  );

  return instruction;
}

export async function deleteCareInstruction(id: string) {
  const conn = await connectUserDB();

  await conn.execute("DELETE FROM care_instruction WHERE id=$1", [id]);
}

export async function neighboringIds(id: string): Promise<string[]> {
  const instructions = await getCareInstructions();
  const totalLength = instructions.length;

  const index = instructions.findIndex((i) => i.id === id);
  const previous =
    index === 0 ? instructions[totalLength - 1].id : instructions[index - 1].id;
  const next =
    index === totalLength - 1 ? instructions[0].id : instructions[index + 1].id;

  return [previous, next];
}
