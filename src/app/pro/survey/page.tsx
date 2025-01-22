"use client";
import React, { useEffect, useState } from "react";
import SurveyPage from "./rating";
import { useRouter } from "next/navigation";
import "./survey.css";
import BackButton from "@/app/core/components/BackButton";
import { invoke } from "@tauri-apps/api/core";
import Button from "@/app/core/components/Button";

export default function Survey() {
  const [isModalOpen, setModalOpen] = useState(false);
  const [questions, setQuestions] = useState<string[]>([]);
  const [surveyResults, setSurveyResults] = useState<
    (string | number)[][] | null
  >(null);
  const router = useRouter();

  useEffect(() => {
    invoke("get_pro_questions").then((questions) => {
      setQuestions(questions as string[]);
    });
  }, []);

  // Function to go back
  const handleGoBack = () => {
    router.back();
    setModalOpen(false);
  };

  // Store responses in sessionStorage and open modal
  const handleSurveySubmit = (responses: (string | number)[][]) => {
    sessionStorage.setItem("surveyResults", JSON.stringify(responses));
    invoke("add_pros", { pros: responses });
    setSurveyResults(responses);
    setModalOpen(true);
  };

  return (
    <div className="Survey">
      <div>
        <BackButton />
        <h1 className="text-align-center">Today's Survey</h1>
        <div className="container">
          <SurveyPage
            count={10}
            size={40}
            questions={questions}
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
            <h3>You have completed your survey for today.</h3>

            <div className="survey-results">
              <h2>Your Responses:</h2>
              {surveyResults ? (
                surveyResults.map((item, index) => (
                  <div key={index}>
                    <div className="container-4">
                      <h3 style={{ marginRight: "5px" }}>
                        {index + 1}. {item[0]}:
                      </h3>
                    </div>
                    <div className="container">
                      <h2>{item[1]}</h2>
                    </div>
                  </div>
                ))
              ) : (
                <p>No survey responses available.</p>
              )}
              <Button
                type="PRIMARY"
                label="Return to Pros"
                onClick={handleGoBack}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
