import React, { useState, useEffect, useRef } from "react";
import "./MedView.css";

//TODO: Place holder for testing, will need to find a better alternative
const medication = {
  name: "Morphine",
  brand: "Brand X",
  prescribedBy: "John Doe",
  phone: "123-456-7890",
  email: "john.doe@example.com",
  addedOn: "January 25, 2023",
  dosage: "15mg",
  frequency: "as needed",
  pillsRemaining: 32,
  pillsTotal: 60,
  lastTaken: "3 hours ago",
  log: [
    {
      takenOn: "August 20, 2024, 08:00 AM",
      dose: "15mg",
      comments: "No side effects",
    },
    {
      takenOn: "August 19, 2024, 10:00 PM",
      dose: "15mg",
      comments: "Mild drowsiness",
    },
    { takenOn: "August 19, 2024, 02:00 PM", dose: "15mg", comments: "Nausea" },
  ],
};

// Define the type for the log entries
interface LogEntry {
  takenOn: string;
  dose: string;
  comments: string;
}

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

//TODO: Add the pill remaining visual circle to the right panel
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
    (medication.pillsRemaining / medication.pillsTotal) * 100;

  const [visibleLogs, setVisibleLogs] = useState<LogEntry[]>([]);
  const [logsToShow, setLogsToShow] = useState(5);
  const logContainerRef = useRef(null);

  useEffect(() => {
    // Load initial logs
    setVisibleLogs(medication.log.slice(0, logsToShow));
  }, [logsToShow]);

  const handleScroll = () => {
    if (logContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = logContainerRef.current;
      if (scrollTop + clientHeight >= scrollHeight) {
        // User has scrolled to the bottom, load more logs
        setLogsToShow((prev) => Math.min(prev + 5, medication.log.length)); // Show 5 more logs
      }
    }
  };

  return (
    <div className="medicine-container">
      <Header name={medication.name} brand={medication.brand} />
      <div className="content">
        <LeftPanel
          prescribedBy={medication.prescribedBy}
          phone={medication.phone}
          email={medication.email}
          addedOn={medication.addedOn}
        />
        <div className="right-panel">
          <h3>Details</h3>
          <div className="details-container">
            <DetailBox
              label="Pills remaining"
              value={`${medication.pillsRemaining}`}
              isPillsRemaining
              pillsPercentage={pillsPercentage}
            />
            <DetailBox label="Dosage" value={medication.dosage} />
            <DetailBox label="Last taken" value={medication.lastTaken} />
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
              {medication.log.map((entry, index) => (
                <tr key={index}>
                  <td>{entry.takenOn}</td>
                  <td>{entry.dose}</td>
                  <td>{entry.comments}</td>
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
