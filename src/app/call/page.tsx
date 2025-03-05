// call/page.tsx
// Ojos Project
"use client";
import classes from "./page.module.css";
import Button from "../core/components/Button";
import { invoke } from "@tauri-apps/api/core";
import WebcamRecorder from "./components/controls";
import useKeyPress from "../accessibility/keyboard_nav";
import { useRouter } from "next/navigation";

export default function Call() {
  const router = useRouter();

  useKeyPress("Escape", () => {
    router.back();
  });
  
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
