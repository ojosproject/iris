import Link from "next/link";
import classes from "./page.module.css";
import Controls from "./components/controls";

export default function Call() {
  return (
    <>
      <header className={classes.header}>
        <Link href="/call/recordings" className={classes.link}>
          <div className={classes.viewRecordings}>View Recordings</div>
        </Link>
      </header>
      <main>
        <h1>Video Call</h1>
        <Controls />
      </main>
    </>
  );
}
