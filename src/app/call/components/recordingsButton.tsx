"use client";
import classes from "./recordingsButton.module.css";
import { useRouter } from "next/navigation";

export default function RecordingsButton() {
  const router = useRouter();
  return (
    <button
      onClick={() => router.push("/call/recordings")}
      className={classes.viewRecordings}
    >
      View Recordings
    </button>
  );
}
