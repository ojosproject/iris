"use client";
import React, { useEffect, useState } from "react";
import SurveyPage from "./rating";
import { useRouter } from "next/navigation";
import "./survey.css";
import BackButton from "@/app/components/BackButton";
import { invoke } from "@tauri-apps/api/core";
import Button from "@/app/components/Button";
import Dialog from "@/app/components/Dialog";
import useKeyPress from "@/app/accessibility/keyboard_nav";
import { ProQuestion } from "../types";

export default function Survey() {
  const [isModalOpen, setModalOpen] = useState(false);
  const [questions, setQuestions] = useState<ProQuestion[]>([]);
  const [surveyResults, setSurveyResults] = useState<
    (string | number)[][] | null
  >(null);
  const router = useRouter();

  useKeyPress("Escape", () => {
    router.back();
  });

  useEffect(() => {
    invoke("get_pro_questions").then((questions) => {
      setQuestions(questions as ProQuestion[]);
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
            size={40}
            questions={questions}
            onSubmit={handleSurveySubmit}
          />
        </div>
      </div>

      {isModalOpen && (
        <Dialog
          title="Thank you!"
          content="You have completed your survey for today"
        >
          <Button
            type="PRIMARY"
            label="Return to Pros"
            onClick={handleGoBack}
          />
        </Dialog>
      )}
    </div>
  );
}
