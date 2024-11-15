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
  format?: "READ" | "MMDDYYYY" | "HH:MM XX",
): string {
  let d = new Date(timestamp * 1000);

  if (!format || format === "READ") {
    return `${MONTHS[d.getMonth()].slice(0, 3)} ${d.getDate()}, ${d.getFullYear()}`;
  } else if (format === "MMDDYYYY") {
    return `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`;
  } else if (format === "HH:MM XX") {
    let hours = d.getHours();
    hours = hours < 12 ? hours : hours - 12;
    let minutes: string | number = d.getMinutes();
    minutes = minutes > 9 ? `${minutes}` : `0${minutes}`;
    let am_pm = d.getHours() > 12 ? "PM" : "AM";

    return `${hours}:${minutes} ${am_pm}`;
  }

  return ``;
}

export function parse_phone_number(digits: number): string {
  let parsed = digits.toString();

  if (parsed.length === 10) {
    return `(${parsed.slice(0, 3)}) ${parsed.slice(3, 6)}-${parsed.slice(6)}`;
  } else if (parsed.length === 11) {
    // if it includes the 1 in the beginning
    // though, please try to prevent that if possible
    return `${parsed.slice(0, 1)} (${parsed.slice(1, 4)}) ${parsed.slice(4, 7)}-${parsed.slice(8)}`;
  }

  // if neither of the above conditions fit, return an empty string
  return "";
}
