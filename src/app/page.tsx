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
  {
    link: "./care-instructions",
    name: "Care Instructions",
    icon: "/images/icon_care_instructions.png",
  },
];

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
    // <main className={styles.main}>
    //   <div className={styles.description}>
    //     <p>
    //       Get started by editing&nbsp;
    //       <code className={styles.code}>src/app/page.tsx</code>
    //     </p>
    //     <div>
    //       <a
    //         href="https://vercel.com?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
    //         target="_blank"
    //         rel="noopener noreferrer"
    //       >
    //         By{" "}
    //         <Image
    //           src="/vercel.svg"
    //           alt="Vercel Logo"
    //           className={styles.vercelLogo}
    //           width={100}
    //           height={24}
    //           priority
    //         />
    //       </a>
    //     </div>
    //   </div>

    //   <div className={styles.center}>
    //     <Image
    //       className={styles.logo}
    //       src="/next.svg"
    //       alt="Next.js Logo"
    //       width={180}
    //       height={37}
    //       priority
    //     />
    //   </div>

    //   <div className={styles.grid}>
    //     <a
    //       href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
    //       className={styles.card}
    //       target="_blank"
    //       rel="noopener noreferrer"
    //     >
    //       <h2>
    //         Docs <span>-&gt;</span>
    //       </h2>
    //       <p>Find in-depth information about Next.js features and API.</p>
    //     </a>

    //     <a
    //       href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
    //       className={styles.card}
    //       target="_blank"
    //       rel="noopener noreferrer"
    //     >
    //       <h2>
    //         Learn <span>-&gt;</span>
    //       </h2>
    //       <p>Learn about Next.js in an interactive course with&nbsp;quizzes!</p>
    //     </a>

    //     <a
    //       href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
    //       className={styles.card}
    //       target="_blank"
    //       rel="noopener noreferrer"
    //     >
    //       <h2>
    //         Templates <span>-&gt;</span>
    //       </h2>
    //       <p>Explore starter templates for Next.js.</p>
    //     </a>

    //     <a
    //       href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
    //       className={styles.card}
    //       target="_blank"
    //       rel="noopener noreferrer"
    //     >
    //       <h2>
    //         Deploy <span>-&gt;</span>
    //       </h2>
    //       <p>
    //         Instantly deploy your Next.js site to a shareable URL with Vercel.
    //       </p>
    //     </a>
    //   </div>
    // </main>
  );
}
