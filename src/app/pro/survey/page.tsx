"use client"
import React from "react";
import SurveyPage from "./rating";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/navigation";
import "./survey.css"

export default function Survey() {
    const [rating, setRating] = React.useState(0);
    const router = useRouter();

    // Example questions
    const example_questions = [
    { question: "How do you feel today?" },
    { question: "How was your experience with our service?" },
    { question: "How likely are you to recommend us?" },
    { question: "How likely would you have your caregiver again?"}
    ];

    // const example_questions = [
    //     "", "", ""
    // ]

    // const respone = [
    //     ["question", "answer"],
    //     []
    // ]
    // array format:
    // [[question: "How do you feel today?"]]
    return (
        <div className="Survey">
            <div>
                <button className="pro_button_1" onClick={() => router.push("./")}>
                        <FontAwesomeIcon icon={faArrowLeft} />
                </button>
                <h1>Survey</h1>
                <div className="container">
                    <SurveyPage
                        count={10}
                        value={rating}
                        onChange={(value) => setRating(value)}
                        size={30} questions={example_questions}
                    />
                </div>
            </div>
        </div>
    );
}