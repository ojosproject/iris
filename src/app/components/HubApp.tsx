import Link from "next/link";
import classes from "./HubApp.module.css";

export type HubAppProps = {
  name: string;
  link: string;
  icon?: string;
};

export default function HubApp({ name, link, icon }: HubAppProps) {
  // todo: add use of icon link for the application icon
  return (
    <Link href={link} className={classes.link}>
      <div className={classes.app}>
        {icon ? (
          <img
            src={icon}
            height={200}
            width={200}
            style={{ borderRadius: "12px" }}
          />
        ) : (
          <div className={classes.iconPL} />
        )}

        <h3> {name} </h3>
      </div>
    </Link>
  );
}
