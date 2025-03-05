import React from "react";
import "./Helper.css";

interface helper_props {
    title: string,
    content: string,
    children: React.ReactNode;
}

const Helper: React.FC<helper_props> = ({ title, content, children }) => { 
    return (
        <div className="helper-overlay">
        <div className="helper-popup">
            <div className="helper-header">
            <h3>{title}</h3>
            </div>
            <div className="helper-content">
            <p>{content}</p>
            </div>
            {children}
        </div>
        </div>
    );
}

export default Helper;