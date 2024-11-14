export const MONTHS = [
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

export function timestampToString(
  timestamp: number,
  format?: "READ" | "MMDDYYYY" | "TIME",
): string {
  let d = new Date(timestamp * 1000);

  if (!format || format === "READ") {
    return `${MONTHS[d.getMonth()].slice(0, 3)} ${d.getDate()}, ${d.getFullYear()}`;
  } else if (format === "MMDDYYYY") {
    return `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`;
  } else if (format === "TIME") {
    let hours = d.getHours();
    hours = hours < 12 ? hours : hours - 12;
    let minutes = d.getMinutes();
    let am_pm = d.getHours() > 12 ? "pm" : "am";

    return `${hours}:${minutes} ${am_pm}`;
  }

  return ``;
}
