/**
 * File:     _Questionnaire.tsx
 * Purpose:  The questionnaire for PROs.
 * Authors:  Ojos Project & Iris contributors
 * License:  GNU General Public License v3.0
 */

// todo: Should be moved to a `pro/_components` folder.
// todo: It hasn't been done, bc it uses `survey/page.module.css`.
// todo: Split that CSS Module and create `_components/Questionnaire.module.css`
import React, { useState, useEffect } from "react";
import styles from "./_Questionnaire.module.css";
import { ProQuestion } from "@/types/pro";

type RatingProps = {
  className?: string;
  size: number;
  onSubmit: (responses: (string | number)[][]) => void;
  questions: ProQuestion[];
};

const FullCircle = ({
  size = 40,
  number = 1,
}: {
  size?: number;
  number?: number;
}) => (
  <svg height={size} viewBox="0 0 48 48">
    <circle
      cx="24"
      cy="24"
      r="20"
      stroke="#0063D7"
      strokeWidth="3"
      fill="#0063D7"
    />
    <text
      x="24"
      y="32"
      textAnchor="middle"
      fontSize="20"
      fontWeight="bold"
      fill="white"
    >
      {number}
    </text>
  </svg>
);

const EmptyCircle = ({
  size = 40,
  number = 1,
}: {
  size?: number;
  number?: number;
}) => (
  <svg height={size} viewBox="0 0 48 48">
    <circle
      cx="24"
      cy="24"
      r="20"
      stroke="#0063D7"
      strokeWidth="3"
      fill="white"
    />
    <text
      x="24"
      y="32"
      textAnchor="middle"
      fontSize="20"
      fill="#0063D7"
      fontWeight="bold"
    >
      {number}
    </text>
  </svg>
);

export default function Questionnaire({
  className,
  size,
  questions,
  onSubmit,
}: RatingProps) {
  const [ratings, setRatings] = useState<number[]>(() => {
    const initialRatings: number[] = [];
    for (let i = 0; i < questions.length; i++) {
      initialRatings.push(NaN);
    }
    return initialRatings;
  });

  // Initialize ratings when questions change
  useEffect(() => {
    setRatings(new Array(questions.length).fill(NaN));
  }, [questions.length]);

  const [isModalOpen, setModalOpen] = React.useState(false); // State for modal visibility
  const [modalContent, setModalContent] = React.useState<string[]>([]);
  const [pageNumber, setPageNumber] = React.useState(1);
  const start = pageNumber - 1;
  const end = pageNumber;

  const stringifiedQuestions = questions.map(
    (proQuestion) => proQuestion.question,
  );

  const handleRatingChange = (index: number, rating: number) => {
    const updatedRatings = [...ratings];
    updatedRatings[index] = rating + 1;
    setRatings(updatedRatings);
  };

  const handleSubmit = () => {
    const unanswered = stringifiedQuestions.filter((_, index) =>
      isNaN(ratings[index]),
    );

    if (unanswered.length > 0) {
      setModalContent(unanswered);
      setModalOpen(true);
      return;
    }

    const responses: [string, number][] = questions.map((q, i) => [
      q.question, // question as a string
      Math.round(Number(ratings[i])),
    ]);

    onSubmit(responses);
  };

  const handleGoBack = () => {
    setModalOpen(false);
  };

  const handleNext = () => {
    setPageNumber(pageNumber + 1);
  };

  const handlePrev = () => {
    setPageNumber(pageNumber - 1);
  };

  const ProgressBar = () => {
    const totalQuestions = questions.length;
    const questionsComplete = ratings.filter((r: number) => !isNaN(r)).length;
    const percentage = ((questionsComplete - 1) / totalQuestions) * 100;
    const newPercentage = (questionsComplete / totalQuestions) * 100;

    const [animatedWidth, setAnimatedWidth] = useState(percentage);

    useEffect(() => {
      // Trigger animation on question update
      setAnimatedWidth(newPercentage);
    }, []);

    return (
      <div className={styles.progressBar}>
        <div className={styles.myBar} style={{ width: `${animatedWidth}%` }}>
          <div className={styles.barLabel}>
            {questionsComplete} / {totalQuestions} completed
          </div>
        </div>
      </div>
    );
  };

  // todo: consider having multiple different types of "category labels"
  // todo: for each category.
  return (
    <div className={styles.surveyLayout}>
      <div className={styles.progressBarContainer}>
        <ProgressBar />
      </div>

      <div className={styles.surveyContent}>
        {/* All the questions go here */}
        {questions.slice(start, end).map((item, index) => (
          <div key={index + start} className={styles.surveyQuestion}>
            {item.question_type === "rating" ? (
              <h3>
                {pageNumber}. In the last two weeks, how often did you feel...
              </h3>
            ) : (
              <h4>hi</h4>
            )}
            <h1>{item.question}</h1>

            <div className={styles.ratingSection}>
              <span className={`${styles.label} ${styles.leftLabel}`}>
                {item.lowest_label}
              </span>
              <div className={styles.ratingOptions}>
                {[...Array(item.highest_ranking)].map((_, i) => {
                  const isSelected = i === ratings[index + start] - 1;
                  return (
                    <div
                      key={i}
                      style={{ cursor: "pointer" }}
                      onClick={() => handleRatingChange(index + start, i)}
                    >
                      {isSelected ? (
                        <FullCircle size={100} number={i + 1} />
                      ) : (
                        <EmptyCircle size={100} number={i + 1} />
                      )}
                    </div>
                  );
                })}
              </div>
              <span className={`${styles.label} ${styles.rightLabel}`}>
                {item.highest_label}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.fixedButtonContainer}>
        <div>
          <button
            className="secondary"
            onClick={handlePrev}
            disabled={pageNumber <= 1}
          >
            Prev Question
          </button>
        </div>
        <div>
          {end < questions.length ? (
            <button
              className="secondary"
              onClick={handleNext}
              disabled={isNaN(ratings[pageNumber - 1])}
            >
              Next Question
            </button>
          ) : (
            <button
              className="primary"
              onClick={handleSubmit}
              disabled={isNaN(ratings[pageNumber - 1])}
            >
              Submit Survey
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
