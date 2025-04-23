import React, { useState, useEffect } from "react";
import "./survey.css";
import Button from "@/app/core/components/Button";
import Dialog from "@/app/core/components/Dialog";
import { ProQuestion } from "../types";

interface RatingProps {
  className?: string;
  size: number;
  onSubmit: (responses: (string | number)[][]) => void;
  questions: ProQuestion[];
}

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
  }

  const handlePrev = () => {
    setPageNumber(pageNumber - 1);
  }

  // todo: consider having multiple different types of "category labels"
  // todo: for each category.
  return (
    <>
    <div className={`survey-page`}>
      {questions.slice(start, end).map((item, index) => (
        <>
        <div key={index + start} className="survey-question">
            {item.question_type == "rating" ? (
              <>
                <h3> {pageNumber}. In the last two weeks, how often did you feel...</h3>
              </>
            ) : (
              <h4> hi</h4>
            )}
          <h1>
            {item.question}
          </h1>
        </div>
          <div className="rating-wrapper">
            <p className="rating-label">{item.lowest_label}</p>
            <div className="rating-options">
              {[...Array(item.highest_ranking)].map((_, i) => {
                const isSelected = i === ratings[index+start] - 1;
                return (
                  <div
                    key={i}
                    style={{ cursor: "pointer" }}
                    onClick={() => handleRatingChange(index+start, i)}
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
            <p className="rating-label text-align-right">
              {item.highest_label}
            </p>
          </div>
        </>
      ))}
      {/* <div className="container-space-between">
      <div className="button-content-prev">
        <Button
        type="SECONDARY" label="Prev Question" onClick={handlePrev} disabled={pageNumber <= 1}
        />
      </div>
      <div className="button-content-next">
        {end < questions.length ? (
          <Button type="SECONDARY" label="Next Question" onClick={handleNext} disabled={isNaN(ratings[pageNumber - 1])} />
        ) : (
          <Button type="PRIMARY" label="Submit Survey" onClick={handleSubmit} disabled={isNaN(ratings[pageNumber - 1])}/>
        )}
      </div>

      </div> */}
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
      <div className="container-space-between">
      <div className="button-content-prev">
        <Button
        type="SECONDARY" label="Prev Question" onClick={handlePrev} disabled={pageNumber <= 1}
        />
      </div>
      <div className="button-content-next">
        {end < questions.length ? (
          <Button type="SECONDARY" label="Next Question" onClick={handleNext} disabled={isNaN(ratings[pageNumber - 1])} />
        ) : (
          <Button type="PRIMARY" label="Submit Survey" onClick={handleSubmit} disabled={isNaN(ratings[pageNumber - 1])}/>
        )}
      </div>
    </div>
    </div>
    </>
  );
};

export default SurveyPage;