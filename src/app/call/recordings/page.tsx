import Link from "next/link";
import classes from "./page.module.css";
import Button from "@/app/components/Button";
import Recording from "./components/recording";
import { RecordingProps } from "./components/recording";

const sampleRecordings: RecordingProps[] = [
  {
    dayOfWeek: "Tuesday",
    month: 8,
    day: 20,
    year: 2024,
    timeStart: 480,
    timeEnd: 500,
    id: 0,
    img: "https://images.pexels.com/photos/20780436/pexels-photo-20780436/free-photo-of-table-near-window-in-kitchen.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  },
  {
    dayOfWeek: "a",
    month: 1,
    day: 0,
    year: 0,
    timeStart: 0,
    timeEnd: 0,
    id: 1,
    img: "https://images.pexels.com/photos/10647646/pexels-photo-10647646.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  },
];

export default function Recordings() {
  return (
    <>
      <header>
        <Button type="PRIMARY" label="Back" link="/" />
      </header>
      <main>
        <h1 className={classes.title}>Video Recordings</h1>
        <div className={classes.list}>
          <ul className={classes.recs}>
            {sampleRecordings.map((rec) => (
              <Recording
                dayOfWeek={rec.dayOfWeek}
                month={rec.month}
                day={rec.day}
                year={rec.year}
                timeStart={rec.timeStart}
                timeEnd={rec.timeEnd}
                id={rec.id}
                img={rec.img}
                key={rec.id}
              />
            ))}
          </ul>
        </div>
      </main>
    </>
  );
}
