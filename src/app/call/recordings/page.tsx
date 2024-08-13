import Link from "next/link";
import classes from "./page.module.css";
import BackButton from "./components/backButton";

export default function Recordings() {
  return (
    <>
      <header>
      <BackButton />
      </header>
      <main>
        <h1>Video Recordings</h1>
      </main>
    </>
  );
}
