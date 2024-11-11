import Image from "next/image";
import classes from "./page.module.css";
import HubHeader from "./components/HubHeader";
import HubApp from "./components/HubApp";
import UpcomingList from "./components/UpcomingList";
import { HubApps } from "./HubApps";

export default function Home() {
  return (
    <>
      <HubHeader></HubHeader>
      <main className={classes.flex}>
        <section className={classes.side1}>
          <h2> Your Apps </h2>
          <ul className={classes.appList}>
            {HubApps.map((hubApp) => (
              <HubApp
                link={hubApp.link}
                icon={hubApp.icon}
                name={hubApp.name}
              />
            ))}
          </ul>
        </section>

        <section className={classes.side2}>
          <h2 className={classes.upcomingHeader}> 💊 Up next... </h2>
          <UpcomingList></UpcomingList>
        </section>
      </main>
    </>
  );
}
