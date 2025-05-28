/**
 * File:     pro/survey/page.tsx
 * Purpose:  A page for the PRO, a wrapper for the SurveyPage component.
 * Authors:  Ojos Project & Iris contributors
 * License:  GNU General Public License v3.0
 */
"use client";
import Button from "@/components/Button";
import Dialog from "@/components/Dialog";
import Layout from "@/components/Layout";
import useKeyPress from "@/components/useKeyPress";
import { ProQuestion } from "@/types/pro";
import { invoke } from "@tauri-apps/api/core";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Questionnaire from "../_components/_Questionnaire";
import styles from "./page.module.css";

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
    <Layout title="Today's Survey">
      <div>
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
    </Layout>
  );
}
