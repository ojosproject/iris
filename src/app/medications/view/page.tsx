"use client";
import { useState, useEffect, useRef, Suspense } from "react";
import styles from "./page.module.css";
import { Medication, MedicationLog } from "../types";
import { User } from "@/app/core/types";
import { invoke } from "@tauri-apps/api/core";
import moment from "moment";
import { useSearchParams } from "next/navigation";
import { parse_phone_number, timestampToString } from "@/app/core/helper";
import BackButton from "@/app/core/components/BackButton";
import useKeyPress from "@/app/accessibility/keyboard_nav";
import { useRouter } from "next/navigation";

const Header = ({ name, brand }: { name: string; brand?: string }) => {
  return (
    <div className={styles.header}>
      <h1>{name}</h1>
      {brand ? <p>Brand: {brand}</p> : null}
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
      <label>{label}</label>
      <p>{value}</p>
    </div>
  );
};

const MedicineView = () => {
  const [visibleLogs, setVisibleLogs] = useState<MedicationLog[]>([]);
  const [logsToShow, setLogsToShow] = useState(5);
  const [medication, setMedication] = useState<Medication>({
    id: "",
    name: "",
    dosage_type: "",
    strength: 0,
    units: "",
    quantity: 0,
    created_at: 0,
    updated_at: 0
  });
  const pillsPercentage = 100; // we'll fix later
  const [prescriptionNurse, setPrescriptionNurse] = useState<User>({
    full_name: "Loading...",
    phone_number: 9999999999,
    email: "Loading...",
    id: "Loading...",
    type_of: "NURSE",
  });
  const logContainerRef = useRef(null);
  const medicationId = useSearchParams().get("id");
  const router = useRouter();

  useKeyPress("Escape", () => {
    router.back();
  });
  {
    useEffect(() => {
      invoke("get_medication_logs", {
        medication: medicationId,
      }).then((medication_log) => {
        setVisibleLogs(medication_log as MedicationLog[]);
      });

      invoke("get_medications", { id: medicationId }).then((m) => {
        setMedication((m as Medication[])[0]);
      });
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
        <Header name={medication.name} brand={medication.generic_name ? medication.generic_name : ""} />
        <div className={styles.content}>
          <LeftPanel
            prescribedBy={prescriptionNurse.full_name}
            phone={
              prescriptionNurse.phone_number
                ? parse_phone_number(prescriptionNurse.phone_number)
                : "N/A"
            } // phone number could be empty, make optional field
            email={prescriptionNurse.email ? prescriptionNurse.email : "N/A"} // email could be empty, make optional field
            addedOn={timestampToString(medication.created_at)}
          />

          <div className={styles.rightPanel}>
            <h3>Details</h3>
            <div className={styles.detailsContainer}>
              <DetailBox
                label="Dosage"
                value={`${medication.strength}${medication.units}`}
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
                  <th style={{ width: 100 }}>Date</th>
                  <th style={{ width: 75 }}>Time</th>
                  <th style={{ width: 50 }}>Dose</th>
                  <th>Comments</th>
                </tr>
              </thead>
              <tbody>
                {visibleLogs.length ? (
                  visibleLogs.map((entry, index) => (
                    <tr key={index}>
                      <td>{`${timestampToString(entry.timestamp)}`}</td>
                      <td>{`${timestampToString(entry.timestamp, "HH:MM XX")}`}</td>
                      <td>{`${entry.strength}${entry.units}`}</td>
                      <td>{entry.comments ? entry.comments : "None"}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="noLog">
                      No logs to display.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

// Required to prevent
// https://github.com/ojosproject/iris/issues/36
export default function WrappedView() {
  return (
    <Suspense>
      <MedicineView />
    </Suspense>
  );
}
