/**
 * File:     call/page.tsx
 * Purpose:  The main calling page. Wraps around the WebcamRecorder component.
 * Authors:  Ojos Project & Iris contributors
 * License:  GNU General Public License v3.0
 */
"use client";
import styles from "./page.module.css";
import Button from "@/components/Button";
import { invoke } from "@tauri-apps/api/core";
import WebcamRecorder from "./_components/WebcamRecorder";
import useKeyPress from "@/components/useKeyPress";
import { useRouter } from "next/navigation";

export default function Call() {
  const router = useRouter();

  useKeyPress("Escape", () => {
    router.back();
  });

  return (
    <>
      <header className={styles.header}>
        <Button
          type="SECONDARY"
          label="View Recordings"
          onClick={() => {
            invoke("open_recordings_folder");
          }}
        />
      </header>
      <main className={styles.videoMain}>
        <WebcamRecorder />
      </main>
    </>
  );
}
