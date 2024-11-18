import { BaseDirectory, exists, writeFile, mkdir } from "@tauri-apps/plugin-fs";

export function saveVideo(blob: Blob) {
  blob.arrayBuffer().then((buffer) => {
    exists("recordings/", { baseDir: BaseDirectory.AppLocalData }).then(
      (doesExist) => {
        if (!doesExist) {
          mkdir("recordings/", { baseDir: BaseDirectory.AppLocalData });
        }
        writeFile(`recordings/${setFileName()}.mp4`, new Uint8Array(buffer), {
          baseDir: BaseDirectory.AppLocalData,
        });
      },
    );
  });
}

export function setFileName(): string {
  let date = new Date();

  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}_${date.getHours()}:${date.getMinutes() < 9 ? `0${date.getMinutes()}` : date.getMinutes()}:${date.getSeconds()}`;
}
