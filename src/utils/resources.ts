import { Resource } from "@/types/resources";
import { connectUserDB } from "./database";

export async function getResources(): Promise<Resource[]> {
  const conn = await connectUserDB();
  const resources: Resource[] = await conn.select(
    "SELECT * FROM resource ORDER BY last_updated DESC",
  );

  return resources;
}
