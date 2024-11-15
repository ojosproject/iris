"use client";
import React, { useEffect, useState } from "react";
import SurveyPage from "./rating";
import { useRouter } from "next/navigation";
import "./survey.css";
import BackButton from "@/app/core/components/BackButton";
import { invoke } from "@tauri-apps/api/core";

export default function Survey() {
  const [rating, setRating] = React.useState(0);
  const [questions, setQuestions] = useState<string[]>([]);
  const router = useRouter();

  useEffect(() => {
    invoke("get_pro_questions").then((q) => {
      setQuestions(q as string[]);
    });
  }, []);

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
        <BackButton />
        <h1>Survey</h1>
        <div className="container">
          <SurveyPage
            count={10}
            value={rating}
            onChange={(value) => setRating(value)}
            size={30}
            questions={questions}
          />
        </div>
      </div>
    </div>
  );
}
