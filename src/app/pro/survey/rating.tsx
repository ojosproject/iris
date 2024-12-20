import React, { useState, useEffect } from "react";
import "./survey.css";
import Button from "@/app/core/components/Button";

interface RatingProps {
  className?: string;
  count: number;
  size: number;
  onSubmit: (responses: (string | number)[][]) => void;
  questions: string[];
}

const FullCircle = ({ size = 24, number = 1 }: { size?: number; number?: number }) => (
  <svg height={size} viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="10" stroke="#0063D7" strokeWidth="3" fill="#0063D7" />
    <text x="12" y="16" textAnchor="middle" fontSize="10" fontWeight="bold" fill="white">
      {number}
    </text>
  </svg>
);

const EmptyCircle = ({ size = 24, number = 1 }: { size?: number; number?: number }) => (
  <svg height={size} viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="10" stroke="#0063D7" strokeWidth="3" fill="white" />
    <text x="12" y="16" textAnchor="middle" fontSize="10" fill="#0063D7" fontWeight="bold">
      {number}
    </text>
  </svg>
);

const SurveyPage: React.FC<RatingProps> = ({ className, count, size, questions, onSubmit }) => {
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

  const handleRatingChange = (index: number, rating: number) => {
    const updatedRatings = [...ratings];
    updatedRatings[index] = rating + 1;
    setRatings(updatedRatings);
  };

  const handleSubmit = () => {
    const unanswered = questions.filter((_, index) => isNaN(ratings[index]));

    if (unanswered.length > 0) {
      setModalContent(unanswered);
      setModalOpen(true);
      return; 
    }

    const responses: [string, number][] = questions.map((q, i) => [
      q, // question as a string
      Math.round(Number(ratings[i])),
    ]);

    onSubmit(responses); 
  };

  const handleGoBack = () => {
    setModalOpen(false);
  };

  return (
    <div className={`survey-page ${className}`}>
      {questions.map((item, index) => (
        <div key={index} className="survey-question">
          <h4>
            <p> {index + 1}. </p>
            {item}
          </h4>
          <div className="rating-options">
            {[...Array(count)].map((_, i) => {
              const isSelected = i === ratings[index] - 1;
              return (
                <div key={i} style={{ cursor: "pointer" }} onClick={() => handleRatingChange(index, i)}>
                  {isSelected ? <FullCircle size={size} number={i + 1} /> : <EmptyCircle size={size} number={i + 1} />}
                </div>
              );
            })}
          </div>
        </div>
      ))}
      <Button type="PRIMARY" label="Submit Survey" onClick={handleSubmit} />
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h1>Unanswered Questions</h1>
            <h3>Please answer all questions below</h3>
            <ul>
              {modalContent.map((question, index) => (
                <div key={index} className="container-4">
                  <p>
                    <strong style={{ marginRight: '5px' }}>
                      {questions.indexOf(question) + 1}.
                      </strong> 
                    {question} 
                  </p>
                </div>
              ))}
            </ul>
          </div>
          <div className="modal-content-2">
            <div className="container-sidebyside">
              <Button 
                type="PRIMARY" 
                label="Continue Survey" 
                onClick={handleGoBack} 
                />
            </div>
        </div>
        </div>
      )}
    </div>
  );
};

export default SurveyPage;
