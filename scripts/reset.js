/**
 * File:     scripts/reset.js
 * Purpose:  Resets the Iris data
 * Authors:  Ojos Project & Iris contributors
 * License:  GNU General Public License v3.0
 */
const fs = require("fs");
const os = require("os");
const path = require("path");

const platform = process.platform;
const homeFolder = os.homedir();
let folders;

switch (platform) {
  case "win32":
    folders = [
      path.join(homeFolder, "AppData", "Roaming", "org.ojosproject.Iris"),
    ];
    break;
  case "darwin":
    folders = [
      path.join(
        homeFolder,
        "Library",
        "Application Support",
        "org.ojosproject.Iris",
      ),
    ];
    break;
  case "linux":
    folders = [
      path.join(homeFolder, ".local", "share", "org.ojosproject.Iris"),
      (folderConfig = path.join(homeFolder, ".config", "org.ojosproject.Iris")),
    ];
    break;
}

folders.forEach((folder) => {
  fs.rmSync(folder, { recursive: true, force: true });
  console.log(`> rm -rf ${folder}`);
});

console.log("\nIris data successfully cleared!");
