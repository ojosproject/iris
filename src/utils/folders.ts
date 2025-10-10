/**
 * File:     utils/folders.ts
 * Purpose:  Functions to get paths to folders in the system.
 * Authors:  Ojos Project & Iris contributors
 * License:  GNU General Public License v3.0
 */
import { appConfigDir, appDataDir, join } from "@tauri-apps/api/path";

export async function userDataDir() {
  const base = await appDataDir();
  return await join(base, "user");
}

export async function userConfigDir() {
  const base = await appConfigDir();
  return await join(base, "user");
}

export async function providerConfigDir() {
  const base = await appConfigDir();
  return await join(base, "provider");
}
