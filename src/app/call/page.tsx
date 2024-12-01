// call/page.tsx
// Ojos Project
"use client";
import classes from "./page.module.css";
import Button from "../core/components/Button";
import { invoke } from "@tauri-apps/api/core";
import WebcamRecorder from "./components/controls";

export default function Call() {
  return (
    <>
      <header className={classes.header}>
        <Button
          type="SECONDARY"
          label="View Recordings"
          onClick={() => {
            invoke("open_recordings_folder");
          }}
        />
      </header>
      <main className={classes.video_main}>
        <WebcamRecorder />
      </main>
    </>
  );
}
