/**
 * File:     pro/survey/page.tsx
 * Purpose:  A page for the PRO, a wrapper for the SurveyPage component.
 * Authors:  Ojos Project & Iris contributors
 * License:  GNU General Public License v3.0
 */
"use client";
import Dialog from "@/components/Dialog";
import Layout from "@/components/Layout";
import useKeyPress from "@/components/useKeyPress";
import { ProQuestion } from "@/types/pro";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Questionnaire from "../_components/_Questionnaire";
import styles from "./page.module.css";
import { addPros, getProQuestions } from "@/utils/pro";

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
    async function initPage() {
      setQuestions(await getProQuestions());
    }
    initPage();
  }, []);

  // Function to go back
  const handleGoBack = () => {
    router.back();
    setModalOpen(false);
  };

  // Store responses in sessionStorage and open modal
  const handleSurveySubmit = async (responses: (string | number)[][]) => {
    sessionStorage.setItem("surveyResults", JSON.stringify(responses));

    await addPros(responses as any);

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
          <button className="primary" onClick={handleGoBack}>
            Return to Pros
          </button>
        </Dialog>
      )}
    </Layout>
  );
}
