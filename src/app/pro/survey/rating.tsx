import React, { useState, useEffect } from "react";
import "./survey.css";
import Button from "@/app/components/Button";
import Dialog from "@/app/components/Dialog";
import { ProQuestion } from "../types";

interface RatingProps {
  className?: string;
  size: number;
  onSubmit: (responses: (string | number)[][]) => void;
  questions: ProQuestion[];
}

const FullCircle = ({
  size = 24,
  number = 1,
}: {
  size?: number;
  number?: number;
}) => (
  <svg height={size} viewBox="0 0 24 24">
    <circle
      cx="12"
      cy="12"
      r="10"
      stroke="#0063D7"
      strokeWidth="3"
      fill="#0063D7"
    />
    <text
      x="12"
      y="16"
      textAnchor="middle"
      fontSize="10"
      fontWeight="bold"
      fill="white"
    >
      {number}
    </text>
  </svg>
);

const EmptyCircle = ({
  size = 24,
  number = 1,
}: {
  size?: number;
  number?: number;
}) => (
  <svg height={size} viewBox="0 0 24 24">
    <circle
      cx="12"
      cy="12"
      r="10"
      stroke="#0063D7"
      strokeWidth="3"
      fill="white"
    />
    <text
      x="12"
      y="16"
      textAnchor="middle"
      fontSize="10"
      fill="#0063D7"
      fontWeight="bold"
    >
      {number}
    </text>
  </svg>
);

const SurveyPage: React.FC<RatingProps> = ({
  className,
  size,
  questions,
  onSubmit,
}) => {
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

  // todo: consider having multiple different types of "category labels"
  // todo: for each category.
  return (
    <div className={`survey-page ${className}`}>
      {questions.map((item, index, arr) => (
        <div key={index} className="survey-question">
          {(index === 0 || arr.at(index - 1)?.category !== item.category) && (
            <h4>In the past 2 weeks, how often did you feel...</h4>
          )}
          <h4>
            <p>{index + 1}. </p>
            {item.question}
          </h4>
          <div className="rating-wrapper">
            <p className="rating-label">{item.lowest_label}</p>
            <div className="rating-options">
              {[...Array(item.highest_ranking)].map((_, i) => {
                const isSelected = i === ratings[index] - 1;
                return (
                  <div
                    key={i}
                    style={{ cursor: "pointer" }}
                    onClick={() => handleRatingChange(index, i)}
                  >
                    {isSelected ? (
                      <FullCircle size={size} number={i + 1} />
                    ) : (
                      <EmptyCircle size={size} number={i + 1} />
                    )}
                  </div>
                );
              })}
            </div>
            <p className="rating-label text-align-right">
              {item.highest_label}
            </p>
          </div>
        </div>
      ))}
      <Button type="PRIMARY" label="Submit Survey" onClick={handleSubmit} />
      {isModalOpen && (
        <Dialog
          title="Unanswered Questions"
          content="Please answer all questions below"
        >
          <ul className="modal-content">
            {modalContent.map((question, index) => (
              <div key={index} className="container-4">
                <p>
                  <strong style={{ marginRight: "5px" }}>
                    {stringifiedQuestions.indexOf(question) + 1}.
                  </strong>
                  {question}
                </p>
              </div>
            ))}
          </ul>
          <div className="container-sidebyside">
            <Button
              type="PRIMARY"
              label="Continue Survey"
              onClick={handleGoBack}
            />
          </div>
        </Dialog>
      )}
    </div>
  );
};

export default SurveyPage;
