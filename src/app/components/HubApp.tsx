import Link from "next/link";
import classes from "./HubApp.module.css";

export type HubAppProps = {
  name: string;
  link: string;
  icon: string;
};

export default function HubApp({ name, link, icon }: HubAppProps) {
  // todo: add use of icon link for the application icon
  return (
    <Link href={link} className={classes.link}>
      <div className={classes.app}>
        <div className={classes.iconPL}></div>
        <h3> {name} </h3>
      </div>
    </Link>
  );
}
