"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import "./results.css";
import "survey-core/defaultV2.min.css";
import { useEffect, useState } from "react";

type SurveyData = {
  [key: string]: string | string[]; // This defines that each key in surveyData is a string or an array of strings
};

export default function Main_page() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [surveyData, setSurveyData] = useState<SurveyData | null>(null);

    useEffect(() => {
        const data = searchParams.get("data");
        if (data) {
            setSurveyData(JSON.parse(data));
        }
    }, [searchParams]);

    // Helper function to display survey data in a structured way
    const renderSurveyData = (data: SurveyData) => {
        return Object.entries(data).map(([key, value]) => (
            <div key={key} className="result-item">
                <h1>{key}: </h1>
                <span>{Array.isArray(value) ? value.join(", ") : value}</span>
            </div>
        ));
    };

    return (
        <>
            <button className="pro_button_1" onClick={() => router.push("./pro")}>
                <FontAwesomeIcon icon={faArrowLeft} />
            </button>
            <h1>Survey Results</h1>
            <div className="results-container">
                {surveyData ? (
                    renderSurveyData(surveyData) // Call the function to render the results
                ) : (
                    <p>No data available</p>
                )}
            </div>
        </>
    );
}
