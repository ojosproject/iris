import Database from "@tauri-apps/plugin-sql";
import { userDataDir } from "./folders";
import { join } from "@tauri-apps/api/path";

export async function connectUserDB() {
  const dataDir = await userDataDir();
  const path = await join(dataDir, "iris.db");
  return Database.load(`sqlite:${path}`);
}
