/**
 * File:     call/page.tsx
 * Purpose:  The main calling page. Wraps around the WebcamRecorder component.
 * Authors:  Ojos Project & Iris contributors
 * License:  GNU General Public License v3.0
 */
"use client";
import styles from "./page.module.css";
import WebcamRecorder from "./_components/WebcamRecorder";
import useKeyPress from "@/components/useKeyPress";
import { useRouter } from "next/navigation";
import { userDataDir } from "@/utils/folders";
import { openPath } from "@tauri-apps/plugin-opener";

export default function Call() {
  const router = useRouter();

  useKeyPress("Escape", () => {
    router.back();
  });

  return (
    <>
      <header className={styles.header}>
        <button
          className="secondary"
          onClick={async () => {
            const dataDir = await userDataDir();
            await openPath(dataDir);
          }}
        >
          View Recordings
        </button>
      </header>
      <main className={styles.videoMain}>
        <WebcamRecorder />
      </main>
    </>
  );
}
