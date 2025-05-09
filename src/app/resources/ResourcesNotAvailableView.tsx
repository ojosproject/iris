import BackButton from "../components/BackButton";
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
          draggable={false}
        />
        <p className={classes.not_found_text}>
          Sorry, no resources were found.
        </p>
        <p className={classes.not_found_text}>
          You can import resources in Settings.
        </p>
      </div>
    </>
  );
}
