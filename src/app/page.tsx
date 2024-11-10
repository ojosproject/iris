import Image from "next/image";
import classes from "./page.module.css";
import HubHeader from "./components/HubHeader";
import HubApp, { HubAppProps } from "./components/HubApp";
import UpcomingList from "./components/UpcomingList";

const HubApps: HubAppProps[] = [
  {
    link: "./log_view",
    name: "Medication Log",
    icon: "/images/icon_pill.png",
  },
  {
    link: "./call",
    name: "Video Call",
    icon: "/images/icon_video.png",
  },
  {
    link: "./resources",
    name: "Resources",
    icon: "/images/icon_resources.png",
  },
].sort((a, b) => {
  // Sorts the icons based on their name
  return a.name.localeCompare(b.name);
});

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
