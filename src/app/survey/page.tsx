"use client";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { Model, Survey, Survey as SurveyComponent } from "survey-react"; 
import { json } from "./json";
import "./survey.css";
import "survey-core/defaultV2.min.css";
import { useState } from "react";

const SurveyPage = () => {
    const [isModalOpen, setModalOpen] = useState(false);
    const [surveyResults, setSurveyResults] = useState(null);
    const router = useRouter();
    const survey = new Model(json);

    survey.onComplete.add((sender, options) => {
        console.log(JSON.stringify(sender.data, null, 3));
        setSurveyResults(sender.data);
        setModalOpen(true);
    });
    // survey.css = customCss;
    // survey.onUpdateQuestionCssClasses.add(function(_, options) {
    //     const classes = options.cssClasses;
    //     if (options.question.getType() === "rating") {
    //         classes.item = "rating-bubble";
    //     }
    // });
    // Handle actions for modal buttons
    const handleGoBack = () => {
        router.push("./pro"); // Navigate to main page
    };

    const handleViewResults = () => {
        const query = new URLSearchParams({ data: JSON.stringify(surveyResults) });
        router.push(`./survey_results?${query.toString()}`);
        setModalOpen(false); // Close modal after viewing results
    };

    
    return (
        <>
        <div className="container-2">
            <button className="button_survey_1" onClick={() => router.back()}>
                <FontAwesomeIcon icon={faArrowLeft} />
            </button>
            <h1>Today's Survey</h1>
        </div>
        <div className="container">
            <Survey model={survey} />
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
                                <button onClick={handleGoBack}>Return to PROs</button>
                                <button onClick={handleViewResults}>View Response</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
        </>
    );
}

export default SurveyPage;
