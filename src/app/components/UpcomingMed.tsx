import classes from "./UpcomingMed.module.css";

type UpcomingMedProps = {
  time: string; // Maybe make it a number?
  name: string;
};

export default function UpcomingMed({ time, name }: UpcomingMedProps) {
  return (
    <div className={classes.med}>
      <p> {time} </p>
      <h3> {name} </h3>
    </div>
  );
}
