/**
 * File:     pro/survey/page.tsx
 * Purpose:  A page for the PRO, a wrapper for the SurveyPage component.
 * Authors:  Ojos Project & Iris contributors
 * License:  GNU General Public License v3.0
 */
"use client";
import React, { useEffect, useState } from "react";
import Questionnaire from "./_Questionnaire";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";
import BackButton from "@/components/BackButton";
import { invoke } from "@tauri-apps/api/core";
import Button from "@/components/Button";
import Dialog from "@/components/Dialog";
import useKeyPress from "@/components/useKeyPress";
import { ProQuestion } from "@/types/pro";

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
    invoke<ProQuestion[]>("get_pro_questions").then((questions) => {
      setQuestions(questions);
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
    <div className={styles.Survey}>
      <div>
        <BackButton />
        <h1 style={{ textAlign: "center" }}>Today's Survey</h1>
        <div className={styles.container}>
          <Questionnaire
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
