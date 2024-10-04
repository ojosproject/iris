"use client";
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import "./MedView.css";
import { Medication, MedicationLog, User } from "@/types";
import { invoke } from "@tauri-apps/api/core";
import moment from "moment";
import obtainName from "../components/medicationName";

//Place holder for testing
const medication: Medication = {
  name: "Morphine",
  brand: "Brand X",
  nurse_id: "1",
  first_added: 1674684000, // Unix timestamp: January 25, 2023 2:00:00 PM GMT-08:00
  dosage: 15,
  measurement: "mg",
  supply: 32,
  total_prescribed: 50,
  last_taken: 1724166000, // Unix timestamp
  frequency: 0.0,
};

interface MedViewProps {
  data: MedicationLog;
}

//Place holder for testing
const log: MedicationLog[] = [
  {
    timestamp: 1724166000, // August 20, 2024 8:00:00 AM GMT-07:00 DST
    medication_name: "Morphine",
    given_dose: 15,
    measurement: "mg",
    comment: "No side effects",
  },
  {
    timestamp: 1724094000, //  August 19, 2024 12:00:00 PM GMT-07:00 DST
    medication_name: "Morphine",
    given_dose: 15,
    measurement: "mg",
    comment: "Mild drowsiness",
  },
  {
    timestamp: 1724101200, // August 19, 2024 2:00:00 PM GMT-07:00 DST
    medication_name: "Morphine",
    given_dose: 15,
    measurement: "mg",
    comment: "Nausea",
  },
];

const nurse: User = {
  id: "1",
  full_name: "Jane Doe",
  type_of: "NURSE",
  phone_number: 5555555555,
  email: "jane@doehealthcare.org",
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

function parse_phone_number(digits: number): string {
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

function convert_to_added_on_string(timestamp: number): string {
  let d = new Date(timestamp * 1000);
  return `${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
}

function convert_to_taken_on_string(timestamp: number): string {
  let d = new Date(timestamp * 1000);
  let hour = d.getHours();
  let minute = d.getMinutes();
  let hour_12 = hour > 12 ? hour - 12 : hour;
  let minute_zeroed = minute < 10 ? `0${minute}` : minute;
  let am_pm = hour > 11 ? "PM" : "AM";

  return `${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}, ${hour_12}:${minute_zeroed} ${am_pm}`;
}

//TODO: dynamically change base on which is selected
const Header = ({ name, brand }: { name: string; brand: string }) => {
  return (
    <div className="header">
      <h1>{name}</h1>
      <p>(Brand: {brand})</p>
    </div>
  );
};

const LeftPanel = ({
  prescribedBy,
  phone,
  email,
  addedOn,
}: {
  prescribedBy: string;
  phone: string;
  email: string;
  addedOn: string;
}) => {
  return (
    <div className="left-panel">
      <h3>Prescribed by</h3>
      <p>{prescribedBy}</p>
      <p>Phone: {phone}</p>
      <p>Email: {email}</p>
      <h3>Added on</h3>
      <p>{addedOn}</p>
    </div>
  );
};

//TODO: dynamically displays remaining pills
const DetailBox = ({
  label,
  value,
  isPillsRemaining,
  pillsPercentage,
}: {
  label: string;
  value: string | number;
  isPillsRemaining?: boolean;
  pillsPercentage?: number;
}) => {
  return (
    <div className={`detail-box ${isPillsRemaining ? "pills-remaining" : ""}`}>
      {isPillsRemaining && (
        <div className="circle-container">
          {" "}
          <strong>Pills Remaining </strong>
          <svg className="progress-circle" viewBox="0 0 36 36">
            <path
              className="circle-bg"
              d="M18 2.0845
                                a 15.9155 15.9155 0 0 1 0 31.831
                                a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            <path
              className="circle"
              strokeDasharray={`${pillsPercentage}, 100`}
              d="M18 2.0845
                                a 15.9155 15.9155 0 0 1 0 31.831
                                a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            <text x="18" y="20.35" className="percentage-text">
              {value}
            </text>
          </svg>
        </div>
      )}
      {!isPillsRemaining && (
        <>
          <span>{label}</span>
          <p>{value}</p>
        </>
      )}
    </div>
  );
};

const MedicineView = () => {
  const pillsPercentage =
    (medication.supply / medication.total_prescribed) * 100;

  const [visibleLogs, setVisibleLogs] = useState<MedicationLog[]>([]);
  const [logsToShow, setLogsToShow] = useState(5);
  const [prescriptionNurse, setPrescriptionNurse] = useState<User>({
    full_name: "Waiting...",
    phone_number: 9999999999,
    email: "Waiting...",
    id: "Waiting...",
    type_of: "NURSE",
  });
  const logContainerRef = useRef(null);

  useEffect(() => {
    invoke("get_medication_logs", { medication: "" }).then((medication_log) => {
      setVisibleLogs(medication_log as MedicationLog[]);
    });

    invoke("get_nurse_info", { nurse_id: "" }).then((nurse) => {
      setPrescriptionNurse(nurse as User);
    });
    setVisibleLogs(log);
    setPrescriptionNurse(nurse);
  }, [logsToShow, prescriptionNurse]);

  const handleScroll = () => {
    if (logContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = logContainerRef.current;
      if (scrollTop + clientHeight >= scrollHeight) {
        // User has scrolled to the bottom, load more logs
        setLogsToShow((prev) => Math.min(prev + 5, visibleLogs.length));
      }
    }
  };

  return (
    <div className="medicine-container">
      <Header name={medication.name} brand={medication.brand} />
      <div className="content">
        <LeftPanel
          prescribedBy={prescriptionNurse.full_name}
          phone={parse_phone_number(prescriptionNurse.phone_number!)} // phone number could be empty, make optional field?
          email={prescriptionNurse.email!} // email could be empty, make optional field?
          addedOn={convert_to_added_on_string(medication.first_added)}
        />
        <div className="right-panel">
          <h3>Details</h3>
          <div className="details-container">
            <DetailBox
              label="Pills remaining"
              value={medication.supply!} // can be empty if they're injections, made this DetailBox optional maybe..?
              isPillsRemaining
              pillsPercentage={pillsPercentage}
            />
            <DetailBox
              label="Dosage"
              value={`${medication.dosage}${medication.measurement}`}
            />
            <DetailBox
              label="Last taken"
              value={moment(medication.last_taken!, "X").fromNow()}
            />{" "}
            {/*medication.last_taken can be empty, please check! */}
            {/*At some point, we should replace moment() */}
            {/* https://momentjs.com/docs/#/-project-status/recommendations/ */}
            {/*https://momentjs.com/docs/#/parsing/string-format/ */}
          </div>
        </div>
      </div>
      <div className="log-section">
        <h3>Log</h3>
        <div
          className="log-table"
          ref={logContainerRef}
          onScroll={handleScroll}
        >
          <table>
            <thead className="log-header">
              <tr>
                <th>Taken on</th>
                <th>Dose</th>
                <th>Comments</th>
              </tr>
            </thead>
            <tbody>
              {visibleLogs.map((entry, index) => (
                <tr key={index}>
                  <td>{convert_to_taken_on_string(entry.timestamp)}</td>
                  <td>{`${entry.given_dose}${entry.measurement}`}</td>
                  <td>{entry.comment}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MedicineView;
