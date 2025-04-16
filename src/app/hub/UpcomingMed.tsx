import classes from "./UpcomingMed.module.css";

type UpcomingMedProps = {
  time: number; // in Epoch seconds
  name: string;
};

function secondsToStringTime(epoch: number): string {
  let epoch_string = new Date(epoch * 1000);
  let hour = epoch_string.getHours();

  return `${hour > 12 ? hour - 12 : hour}:${epoch_string.getMinutes()} ${hour > 12 ? "AM" : "PM"}`;
}

export default function UpcomingMed({ time, name }: UpcomingMedProps) {
  return (
    <div className={classes.med}>
      <p> {secondsToStringTime(time)} </p>
      <h3> {name} </h3>
    </div>
  );
}
