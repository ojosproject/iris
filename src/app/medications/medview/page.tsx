"use client";
import { useState, useEffect, useRef } from "react";
import styles from "./MedView.module.css";
import { Medication, MedicationLog, User } from "@/types";
import { invoke } from "@tauri-apps/api/core";
import moment from "moment";
import MedicationLogButton from "./components/returnButton";
import { useSearchParams } from "next/navigation";
import { MONTHS } from "@/helper";

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
  return `${MONTHS[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
}

function convert_to_taken_on_string(timestamp: number): string {
  let d = new Date(timestamp * 1000);
  let hour = d.getHours();
  let minute = d.getMinutes();
  let hour_12 = hour > 12 ? hour - 12 : hour;
  let minute_zeroed = minute < 10 ? `0${minute}` : minute;
  let am_pm = hour > 11 ? "PM" : "AM";

  return `${MONTHS[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}, ${hour_12}:${minute_zeroed} ${am_pm}`;
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
      {prescribedBy === "Loading..." ? null : (
        <>
          <h3>Prescribed by</h3>
          <p>{prescribedBy}</p>
          <p>Phone: {phone}</p>
          <p>Email: {email}</p>{" "}
        </>
      )}
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
  const [medication, setMedication] = useState<Medication>({
    name: "Loading...",
    brand: "Loading...",
    dosage: 0,
    first_added: 0,
    frequency: 0,
    measurement: "Loading...",
    nurse_id: "0",
    supply: 0,
    total_prescribed: 0,
  });
  const pillsPercentage = 0; // we'll fix later
  const [prescriptionNurse, setPrescriptionNurse] = useState<User>({
    full_name: "Loading...",
    phone_number: 9999999999,
    email: "Loading...",
    id: "Loading...",
    type_of: "NURSE",
  });
  const logContainerRef = useRef(null);
  const medication_name = useSearchParams().get("name");
  {
    useEffect(() => {
      invoke("get_medication_logs", {
        medication: medication_name,
      }).then((medication_log) => {
        setVisibleLogs(medication_log as MedicationLog[]);
      });

      invoke("get_medication", { medication: medication_name }).then((m) => {
        setMedication((m as Medication[])[0]);
      });

      invoke("get_nurse_info", { nurse_id: medication.nurse_id }).then(
        (nurse) => {
          setPrescriptionNurse(nurse as User);
        },
      );
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
        <Header name={medication.name} brand={medication.brand} />
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
                value={`${medication.dosage}${medication.measurement}`}
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
          {visibleLogs.length ? (
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
          ) : (
            <p>No logs to display.</p>
          )}
        </div>
      </div>
    </>
  );
};

export default MedicineView;
