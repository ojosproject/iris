"use client";
import React from "react";
import { useRouter } from "next/navigation";
import BackButton from "@/app/components/BackButton";

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
