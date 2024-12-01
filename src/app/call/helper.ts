// call/helper.ts
// Ojos Project
import { BaseDirectory, exists, writeFile, mkdir } from "@tauri-apps/plugin-fs";

async function ensureRecordingsFolderExists() {
  const folderExists = await exists("recordings/", {
    baseDir: BaseDirectory.AppData,
  });

  if (!folderExists) {
    mkdir("recordings/", { baseDir: BaseDirectory.AppData });
  }
}

export async function saveVideo(blob: Blob) {
  const date = new Date();
  const fileName = `${Math.round(date.getTime() / 1000)}.mp4`;

  await ensureRecordingsFolderExists();

  blob.arrayBuffer().then((buffer) => {
    writeFile(`recordings/${fileName}`, new Uint8Array(buffer), {
      baseDir: BaseDirectory.AppLocalData,
    });
  });
}
