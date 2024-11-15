"use client";
import { useState, useEffect, useRef } from "react";
import styles from "./page.module.css";
import { Medication, MedicationLog } from "../types";
import { User } from "@/app/core/types";
import { invoke } from "@tauri-apps/api/core";
import moment from "moment";
import { useSearchParams } from "next/navigation";
import { parse_phone_number, timestampToString } from "@/app/core/helper";
import BackButton from "@/app/core/components/BackButton";

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
  const pillsPercentage =
    100 * (medication.supply / medication.total_prescribed); // we'll fix later
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
      <BackButton />
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
            addedOn={timestampToString(medication.first_added)}
          />

          <div className={styles.rightPanel}>
            <h3>Details</h3>
            <div className={styles.detailsContainer}>
              {medication.supply ? ( // Check if supply is available
                <DetailBox
                  label="Supply remaining"
                  value={`${medication.supply}${medication.measurement}`}
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
                      <td>{`${timestampToString(entry.timestamp)}, ${timestampToString(entry.timestamp, "HH:MM XX")}`}</td>
                      <td>{`${entry.given_dose}${entry.measurement}`}</td>
                      <td>{entry.comment ? entry.comment : "None"}</td>
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
