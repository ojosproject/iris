"use client";
import classes from "./page.module.css";
import Camera from "./components/camera";
import Button from "../core/components/Button";
import { invoke } from "@tauri-apps/api/core";

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
      <main>
        <Camera />
      </main>
    </>
  );
}
