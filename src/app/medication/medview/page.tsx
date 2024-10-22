"use client";
import { useState, useEffect, useRef } from "react";
import styles from "./MedView.module.css";
import { Medication, MedicationLog, User } from "@/types";
import { invoke } from "@tauri-apps/api/core";
import moment from "moment";
import MedicationLogButton from "./components/returnButton";
import { useSearchParams } from "next/navigation";

//Place holder for testing
const medication: Medication = {
  name: "Morphine",
  brand: "Brand X",
  nurse_id: "1",
  first_added: 1674684000, // Unix timestamp: January 25, 2023 2:00:00 PM GMT-08:00
  dosage: 15,
  measurement: "mg",
  supply: 10,
  total_prescribed: 50,
  last_taken: 1724166000, // Unix timestamp
  frequency: 0.0,
};

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

const Header = ({ name, brand }: { name: string; brand: string }) => {
  return (
    <div className={styles.header}>
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
    <div className={styles.leftPanel}>
      <h3>Prescribed by</h3>
      <p>{prescribedBy}</p>
      <p>Phone: {phone}</p>
      <p>Email: {email}</p>
      <h3>Added on</h3>
      <p>{addedOn}</p>
    </div>
  );
};

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
    <div
      className={`${styles.detailBox} ${isPillsRemaining ? styles.pillsRemaining : ""}`}
    >
      {isPillsRemaining && pillsPercentage !== undefined && (
        <div className={styles.circleContainer}>
          {" "}
          <strong>Pills Remaining </strong>
          <svg className={styles.progressCircle} viewBox="0 0 36 36">
            <path
              className={styles.circleBg}
              d="M18 2.0845
                                a 15.9155 15.9155 0 0 1 0 31.831
                                a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            <path
              className={styles.circle}
              strokeDasharray={`${pillsPercentage}, 100`}
              d="M18 2.0845
                                a 15.9155 15.9155 0 0 1 0 31.831
                                a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            <text x="18" y="20.35" className={styles.percentageText}>
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
  const [visibleLogs, setVisibleLogs] = useState<MedicationLog[]>([]);
  const [logsToShow, setLogsToShow] = useState(5);
  const pillsPercentage =
    (medication.supply / medication.total_prescribed) * 100;
  const [prescriptionNurse, setPrescriptionNurse] = useState<User>({
    full_name: "Waiting...",
    phone_number: 9999999999,
    email: "Waiting...",
    id: "Waiting...",
    type_of: "NURSE",
  });
  const logContainerRef = useRef(null);
  {
    useEffect(() => {
      invoke("get_medication_logs", { medication: "" }).then(
        (medication_log) => {
          setVisibleLogs(medication_log as MedicationLog[]);
        },
      );

      invoke("get_nurse_info", { nurse_id: "" }).then((nurse) => {
        setPrescriptionNurse(nurse as User);
      });
      setVisibleLogs(log);
      setPrescriptionNurse(nurse);
    }, [logsToShow, prescriptionNurse]);
  }

  const handleScroll = () => {
    if (logContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = logContainerRef.current;
      if (scrollTop + clientHeight >= scrollHeight) {
        // User has scrolled to the bottom, load more logs
        setLogsToShow((prev) => Math.min(prev + 5, visibleLogs.length));
      }
    }
  };

  const searchParams = useSearchParams();
  const medicationName =
    searchParams.get("medication_name") || "Unknown Medication";
  const medicationDose = searchParams.get("given_dose") || "Unknown Dosage";
  const medicationMeasurement =
    searchParams.get("given_measurement") || "Unknown Measurement";
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <MedicationLogButton />
      <div className={styles.medicineContainer}>
        <Header name={medicationName} brand={medication.brand} />
        <div className={styles.content}>
          <LeftPanel
            prescribedBy={prescriptionNurse.full_name}
            phone={
              prescriptionNurse.phone_number
                ? parse_phone_number(prescriptionNurse.phone_number)
                : "N/A"
            } // phone number could be empty, make optional field
            email={prescriptionNurse.email ? prescriptionNurse.email : "N/A"} // email could be empty, make optional field
            addedOn={convert_to_added_on_string(medication.first_added)}
          />
          <div className={styles.rightPanel}>
            <h3>Details</h3>
            <div className={styles.detailsContainer}>
              {medication.supply ? ( // Check if supply is available
                <DetailBox
                  label="Pills remaining"
                  value={medication.supply}
                  isPillsRemaining
                  pillsPercentage={pillsPercentage}
                />
              ) : (
                <div>No pills data available.</div> // Handle case when supply is not available (e.g., injections)
              )}
              <DetailBox
                label="Dosage"
                value={`${medicationDose}${medicationMeasurement}`}
              />
              <DetailBox
                label="Last taken"
                value={
                  medication.last_taken
                    ? moment(medication.last_taken, "X").fromNow()
                    : "N/A"
                }
              />{" "}
              {/*medication.last_taken can be empty*/}
              {/*At some point, we should replace moment() */}
              {/* https://momentjs.com/docs/#/-project-status/recommendations/ */}
              {/*https://momentjs.com/docs/#/parsing/string-format/ */}
            </div>
          </div>
        </div>
        <div className={styles.logSection}>
          <h3>Log</h3>
          <div
            className={styles.logTable}
            ref={logContainerRef}
            onScroll={handleScroll}
          >
            <table>
              <thead className={styles.logHeader}>
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
    </>
  );
};

export default MedicineView;
