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
  const medicationName = useSearchParams().get("name");
  const router = useRouter();
  
  useKeyPress("Escape", () => {
    router.back();
  });
  {
    useEffect(() => {
      invoke("get_medication_logs", {
        medication: medicationName,
      }).then((medication_log) => {
        setVisibleLogs(medication_log as MedicationLog[]);
      });

      invoke("get_medication", { medication: medicationName }).then((m) => {
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
                  label="Remaining"
                  value={`${medication.supply}${medication.measurement}`}
                  isPillsRemaining
                  pillsPercentage={pillsPercentage}
                />
              ) : (
                <div>No data available.</div> // Handle case when supply is not available (e.g., injections)
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
                {visibleLogs.length ? (
                  visibleLogs.map((entry, index) => (
                    <tr key={index}>
                      <td>
                        {`${timestampToString(entry.timestamp)}, ${timestampToString(entry.timestamp, "hh:mm a")}`}
                      </td>
                      <td>{`${entry.given_dose}${entry.measurement}`}</td>
                      <td>{entry.comment ? entry.comment : "None"}</td>
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
