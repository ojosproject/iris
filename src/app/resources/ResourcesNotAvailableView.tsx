import BackButton from "../core/components/BackButton";
import classes from "./page.module.css";
import Image from "next/image";

export default function ResourcesNotAvailableView() {
  return (
    <>
      <BackButton />
      <header className={classes.header}>
        <h1>Resources</h1>
      </header>

      <div className={classes.not_found}>
        <Image
          className={classes.not_found_icon}
          src="/images/alert-circle-outline.svg"
          alt="Alert icon"
          width={100}
          height={100}
        />
        <p className={classes.not_found_text}>
          Sorry, the resources could not be loaded at this time.
        </p>
        <p className={classes.not_found_text}>Please try again later.</p>
      </div>
    </>
  );
}
