import classes from "./recording.module.css";

// todo: edit the props of this class to match the data stored within the recording files
export type RecordingProps = {
  dayOfWeek: string;
  month: number;
  day: number;
  year: number;
  timeStart: number; // in minutes
  timeEnd: number;
  id: number;
};

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

type time = {
  hr: number;
  min: number;
};

function minToHrMin(minutes: number): time {
  const hr = Math.floor(minutes / 60);
  const min = minutes % 60;
  return { hr: hr, min: min };
}

// todo: add an img element within the div that has the "image" class
export default function Recording({
  dayOfWeek,
  month,
  day,
  year,
  timeStart,
  timeEnd,
}: RecordingProps) {
  const start = minToHrMin(timeStart);
  const end = minToHrMin(timeEnd);
  const duration = minToHrMin(timeEnd - timeStart);
  return (
    <li className={classes.recording}>
      <div className={classes.image}></div>
      <div className={classes.info}>
        <h2 className={classes.date}>
          {" "}
          {dayOfWeek}, {months[month - 1]} {day}, {year}{" "}
        </h2>
        <h3 className={classes.times}>
          {" "}
          {start.hr}:{start.min} - {end.hr}:{end.min}{" "}
        </h3>
        <p className={classes.duration}>
          {" "}
          {duration.hr} hr, {duration.min} min{" "}
        </p>
      </div>
    </li>
  );
}
