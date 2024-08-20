import React, { useState } from "react";
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
};

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
        <div
          className="circle-background"
          style={
            {
              "--pills-percentage": `${pillsPercentage}%`,
            } as React.CSSProperties
          }
        ></div>
      )}
      <span>{label}</span>
      <p>{value}</p>
    </div>
  );
};

const pillsPercentage =
  (medication.pillsRemaining / medication.pillsTotal) * 100;

const MedicineView = () => {
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
        <table>
          <thead>
            <tr>
              <th>Taken on</th>
              <th>Dose</th>
              <th>Comments</th>
            </tr>
          </thead>
          <tbody>{/* TODO: add Log entries here */}</tbody>
        </table>
      </div>
    </div>
  );
};

export default MedicineView;
