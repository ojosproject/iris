/**
 * File:     utils/parsing.ts
 * Purpose:  Basic functions/commands for parsing dates, times, and numbers.
 * Authors:  Ojos Project & Iris contributors
 * License:  GNU General Public License v3.0
 */
export const months = [
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

export const daysOfWeek = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export function timestampToString(
  timestamp: number,
  format?: "READ" | "MMDDYYYY" | "HH:MM XX",
): string {
  let d = new Date(timestamp * 1000);

  if (!format || format === "READ") {
    return `${months[d.getMonth()].slice(0, 3)} ${d.getDate()}, ${d.getFullYear()}`;
  } else if (format === "MMDDYYYY") {
    return `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`;
  } else if (format === "HH:MM XX") {
    let hours = d.getHours();
    hours = hours <= 12 ? hours : hours - 12;
    let minutes: string | number = d.getMinutes();
    minutes = minutes > 9 ? `${minutes}` : `0${minutes}`;
    let am_pm = d.getHours() >= 12 ? "PM" : "AM";
    return `${hours === 0 ? 12 : hours}:${minutes} ${am_pm}`;
  }

  return ``;
}

export function parsePhoneNumber(digits: number | string): string {
  let parsed = sanitizePhoneNumber(digits);
  if (4 > parsed.length) {
    return parsed;
  } else if (parsed.length < 7) {
    return `(${parsed.slice(0, 3)}) ${parsed.slice(3, 6)}`;
  } else if (parsed.length < 11) {
    return `(${parsed.slice(0, 3)}) ${parsed.slice(3, 6)}-${parsed.slice(6)}`;
  } else if (parsed.length === 11) {
    // if it includes the 1 in the beginning
    // though, please try to prevent that if possible
    return `${parsed.slice(0, 1)} (${parsed.slice(1, 4)}) ${parsed.slice(4, 7)}-${parsed.slice(7)}`;
  }

  // if neither of the above conditions fit, return an empty string
  return "";
}

export function sanitizePhoneNumber(digits: number | string): string {
  let parsed = digits.toString();
  let cleanedNumber = "";
  parsed.split("").forEach((char) => {
    if (["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"].includes(char)) {
      cleanedNumber += char;
    }
  });
  if (cleanedNumber.length > 11) {
    return "";
  }
  return cleanedNumber;
}

export function getTimeOfDay(): "morning" | "afternoon" | "evening" {
  // Remember that Date.getHours() returns in 24-hour format
  let hour = new Date().getHours();

  if (hour >= 17) {
    return "evening";
  } else if (hour >= 12 && hour < 17) {
    return "afternoon";
  }
  return "morning";
}
