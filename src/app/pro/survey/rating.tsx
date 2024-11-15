"use client";

import "./survey.css";
/*import "survey-core/defaultV2.min.css";*/
import React from "react";

interface RatingProps {
  className?: string;
  count: number;
  size: number;
  value: number;
  onChange: (rating: number) => void;
  initialValue?: number;
  fullIcon?: React.ReactElement;
  emptyIcon?: React.ReactElement;
  questions: { question: string }[];
}

interface IconProps {
  size?: number;
  color?: string;
  number?: number;
}

const FullCircle = ({
  size = 24,
  color = "#000000",
  number = 1,
}: IconProps) => {
  return (
    <div style={{ color: color }}>
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
    </div>
  );
};

const EmptyCircle = ({
  size = 24,
  color = "#000000",
  number = 1,
}: IconProps) => {
  return (
    <div style={{ color: color }}>
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
    </div>
  );
};

const SurveyPage: React.FC<RatingProps> = ({
  className,
  value = 10,
  size = 30,
  count,
  onChange,
  initialValue = 0,
  fullIcon = <FullCircle />,
  emptyIcon = <EmptyCircle />,
  questions,
}) => {
  // State for each question's rating
  const [ratings, setRatings] = React.useState<number[]>(
    Array(questions.length).fill(0),
  );

  // Handle change for each question's rating
  const handleRatingChange = (index: number, newRating: number) => {
    const updatedRatings = [...ratings];
    // Set rating to 1-based value
    updatedRatings[index] = newRating + 1;
    setRatings(updatedRatings);
    onChange(newRating + 1);
  };

  return (
    <div className={`rating ${className}`}>
      {questions.map((item, index) => (
        <div key={index} style={{ marginBottom: "20px" }}>
          <h4>{item.question}</h4>
          <div style={{ display: "flex", gap: "8px" }}>
            {[...Array(count)].map((_, i) => {
              const circle =
                i === ratings[index] - 1
                  ? React.cloneElement(fullIcon, { size: size, number: i + 1 })
                  : React.cloneElement(emptyIcon, {
                      size: size,
                      number: i + 1,
                    });
              return (
                <div
                  key={i}
                  style={{ cursor: "pointer" }}
                  onClick={() => handleRatingChange(index, i)}
                >
                  {circle}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};
export default SurveyPage;
