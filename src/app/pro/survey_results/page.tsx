"use client";
import { useRouter, useSearchParams } from "next/navigation";
import "./results.css";
import "survey-core/defaultV2.min.css";
import { useEffect, useState } from "react";
import BackButton from "@/app/core/components/BackButton";

type SurveyData = {
  [key: string]: string | string[]; // This defines that each key in surveyData is a string or an array of strings
};

export default function SurveyResults() {
    const router = useRouter();
    const [surveyData, setSurveyData] = React.useState<any>(null);

    React.useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const data = params.get("data");

        if (data) {
            setSurveyData(JSON.parse(decodeURIComponent(data)));
        } else {
            console.error("No survey results found");
        }
    }, []);

    return (
        <div className="SurveyResults">
            <BackButton/>
            <h1>Survey Results</h1>
            <div className="container">
                {surveyData ? (
                    <div>
                        <h2>Your Responses:</h2>
                        <ul>
                            {surveyData.map((item: [string, string], index: number) => (
                                <li key={index}>
                                    <strong>{item[0]}</strong>: {item[1]}
                                </li>
                            ))}
                        </ul>
                    </div>
                ) : (
                    <p>No survey results available.</p>
                )}
            </div>
        </div>
    );
}
