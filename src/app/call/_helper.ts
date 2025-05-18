/**
 * File:     call/_helper.ts
 * Purpose:  Helper functions for the Call tool.
 * Authors:  Ojos Project & Iris contributors
 * License:  GNU General Public License v3.0
 */
import { BaseDirectory, exists, writeFile, mkdir } from "@tauri-apps/plugin-fs";
import { platform } from "@tauri-apps/plugin-os";

function properPath(): string {
  if (platform() === "windows") {
    return "recordings\\";
  } else {
    return "recordings/";
  }
}

async function ensureRecordingsFolderExists() {
  const folderExists = await exists(properPath(), {
    baseDir: BaseDirectory.AppData,
  });

  if (!folderExists) {
    mkdir(properPath(), { baseDir: BaseDirectory.AppData });
  }
}

export async function saveVideo(blob: Blob) {
  const date = new Date();
  const fileName = `${Math.round(date.getTime() / 1000)}.mp4`;

  await ensureRecordingsFolderExists();

  blob.arrayBuffer().then((buffer) => {
    writeFile(`${properPath()}${fileName}`, new Uint8Array(buffer), {
      baseDir: BaseDirectory.AppData,
    });
  });
}
