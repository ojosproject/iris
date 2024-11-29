import { BaseDirectory, exists, writeFile, mkdir } from "@tauri-apps/plugin-fs";

export function saveVideo(blob: Blob) {
  const date = new Date();
  const fileName = `${Math.round(date.getTime() / 1000)}.mp4`;

  blob.arrayBuffer().then((buffer) => {
    exists("recordings/", { baseDir: BaseDirectory.AppLocalData }).then(
      (doesExist) => {
        if (!doesExist) {
          mkdir("recordings/", { baseDir: BaseDirectory.AppLocalData });
        }
        writeFile(`recordings/${fileName}`, new Uint8Array(buffer), {
          baseDir: BaseDirectory.AppLocalData,
        });
      },
    );
  });
}
