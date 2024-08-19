import classes from "./UpcomingList.module.css";
import UpcomingMed from "./UpcomingMed";

// todo: add fetching for the list of upcoming medicines
// for now, using a hard-coded array of data
type UpcomingMedData = {
  name: string;
  time: string;
};

const upcomingMeds: UpcomingMedData[] = [
  { name: "Med 1", time: "10:00 AM" },
  { name: "Med 2", time: "2:00 PM" },
  { name: "Med 3", time: "3:30 PM" },
];

export default function UpcomingList() {
  return (
    <ul className={classes.medList}>
      {upcomingMeds.map((med) => {
        return (
          <li>
            <UpcomingMed time={med.time} name={med.name}></UpcomingMed>
          </li>
        );
      })}
    </ul>
  );
}
