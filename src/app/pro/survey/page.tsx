"use client";
import React, { useEffect, useState } from "react";
import SurveyPage from "./rating";
import { useRouter } from "next/navigation";
import "./survey.css";
import BackButton from "@/app/core/components/BackButton";
import { invoke } from "@tauri-apps/api/core";
import Button from "@/app/core/components/Button";

export default function Survey() {
    const [isModalOpen, setModalOpen] = React.useState(false);
    const [questions, setQuestions] = useState<string[]>([]);
    const router = useRouter();

    useEffect(() => {
        invoke("get_pro_questions").then(questions => {
            setQuestions(questions as string[]);
        })
    }, [])

    // Function to go back
    const handleGoBack = () => {
        router.back(); // Navigate to main page
    };

    // View results after survey submission
    const handleViewResults = () => {
        // Get the results from sessionStorage
        const results = sessionStorage.getItem("surveyResults");
        if (results) {
            router.push(`./survey_results?data=${encodeURIComponent(results)}`); // Pass results as query parameter
        } else {
            console.error("Survey results are not available");
        }
        setModalOpen(false); // Close modal after viewing results
    };

    // Store responses in sessionStorage and open modal
    const handleSurveySubmit = (responses: (string | number)[][]) => {
        console.log("Survey Responses:", responses);
        // Store the results in sessionStorage as a JSON string
        sessionStorage.setItem("surveyResults", JSON.stringify(responses));
        invoke('add_pros', {pros: responses});
        console.log("pros in survey/page.tsx: ", responses)
        setModalOpen(true); // Open modal after survey submission
    };

    return (
        <div className="Survey">
            <div>
                <BackButton />
                <h1>Survey</h1>
                <div className="container">
                    <SurveyPage
                        count={10} // Dynamically set count based on number of questions
                        size={40}
                        questions={questions} // Pass the updated questions array
                        onSubmit={handleSurveySubmit}
                    />
                </div>
            </div>
            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="container">
                            <h1>Thank you!</h1>
                        </div>
                        <h3>
                            You have completed your survey for today.
                        </h3>
                        <div className="container-sidebyside">
                            <Button type="SECONDARY" label="Return to Pros" onClick={handleGoBack} />
                            <Button type="SECONDARY" label="View Response" onClick={handleViewResults} />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};