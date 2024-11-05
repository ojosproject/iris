"use client";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { Survey as SurveyComponent } from "survey-react"; 
import { SurveyModel } from "survey-core"; 
import { json } from "./json"; // Your survey JSON data
import "./survey.css"; // Ensure this path is correct

const SurveyPage = () => {
    const router = useRouter();
    const survey = new SurveyModel(json);

    // Add a handler for when the survey is completed
    survey.onComplete.add((sender) => {
        console.log(JSON.stringify(sender.data, null, 3));
    });

    return (
        <>
        <button onClick={() => router.back()}>
            <FontAwesomeIcon icon={faArrowLeft} />
        </button>
        <h1>Today's Survey</h1>
        <div className="container">
            {survey && <SurveyComponent model={survey} />}
        </div>
        </>
    );
}

export default SurveyPage;
