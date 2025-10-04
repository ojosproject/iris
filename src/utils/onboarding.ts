import { mkdir, exists } from "@tauri-apps/plugin-fs";
import { userDataDir } from "./folders";
import { join } from "@tauri-apps/api/path";
import { getConfig } from "./settings";
import { connectUserDB } from "./database";
import { CARE_INSTRUCTIONS_SCHEMA } from "@/types/care-instructions";
import { MEDICATION_SCHEMA } from "@/types/medications";
import { PRO_SCHEMA } from "@/types/pro";
import { RESOURCE_SCHEMA } from "@/types/resources";
import { CONTACT_SCHEMA } from "@/types/contacts";

export async function setupOnboarding() {
  const dataDir = await userDataDir();
  const dbPath = await join(dataDir, "iris.db");
  const recordingsPath = await join(dataDir, "recordings");
  const dbExists = await exists(dbPath);

  if (!dbExists) {
    const combinedSchema =
      CARE_INSTRUCTIONS_SCHEMA +
      MEDICATION_SCHEMA +
      PRO_SCHEMA +
      RESOURCE_SCHEMA +
      CONTACT_SCHEMA;

    await mkdir(recordingsPath, { recursive: true });
    await getConfig();

    const conn = await connectUserDB();
    await conn.execute(combinedSchema);
  }
}
