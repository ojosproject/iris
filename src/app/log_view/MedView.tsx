import React, { useState } from "react";
import './MedView.css';

const MedicineView = () => {
    return (
        <div className="medicine-container">
            <div className="header">
                <h1>Morphine</h1>
                <p>(Brand: ...)</p>
            </div>
            <div className="content">
                <div className="left-panel">
                    <h3>Prescribed by</h3>
                    <p>John Doe</p>
                    <p>Phone: ...</p>
                    <p>Email: ...</p>
                    <h3>Added on</h3>
                    <p>January 25, 2023</p>
                </div>
                <div className="right-panel">
                    <h3>Details</h3>
                    <div className="details-container">
                        <div className="detail-box">
                            <div className="circle">
                                <span>32</span>
                                <p>pills remaining</p>
                            </div>
                        </div>
                        <div className="detail-box">
                            <span>15mg</span>
                            <p>as needed</p>
                        </div>
                        <div className="detail-box">
                            <span>3 hours ago</span>
                            <p>Last taken</p>
                        </div>
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
                    <tbody>
                        {/* TODO: add Log entries here */}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default MedicineView;