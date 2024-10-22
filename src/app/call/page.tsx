"use client";
import Link from "next/link";
import classes from "./page.module.css";
import Controls from "./components/controls";
import Camera from "./components/camera";
import RecordingsButton from "./components/recordingsButton";
import { useState } from "react";

export default function Call() {
  const [camOn, setCamOn] = useState(true);
  const [micOn, setMicOn] = useState(true);
  return (
    <>
      <header className={classes.header}>
        {/* <Link href="/call/recordings" className={classes.link}>
          <div className={classes.viewRecordings}>View Recordings</div>
        </Link> */}
        <RecordingsButton />
      </header>
      <main>
        {/* <h1>Video Call</h1> */}
        <Camera/>
      </main>
    </>
  );
}
