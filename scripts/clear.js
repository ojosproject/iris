/**
 * File:     scripts/clear.js
 * Purpose:  Clears repository of temporary `folders`
 * Authors:  Ojos Project & Iris contributors
 * License:  GNU General Public License v3.0
 */
const fs = require("fs");
const folders = [".next/", "node_modules/", "next-env.d.ts", "out/", "src-tauri/target/"];

folders.forEach((folder) => {
  fs.rmSync(folder, { recursive: true, force: true });
  console.log(`> rm -rf ${folder}`);
});

console.log("\nDone! Continue with...\n$ pnpm i\n$ pnpm run dev");
