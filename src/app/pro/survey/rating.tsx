// SurveyPage Component
import React, { useState } from "react";
import "./survey.css";
import Button from "@/app/core/components/Button";

interface RatingProps {
    className?: string;
    count: number;
    size: number;
    onSubmit: (responses: string[][]) => void;
    questions: string[];
}

const FullCircle = ({ size = 24, number = 1 }: { size?: number; number?: number }) => (
    <svg height={size} viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" stroke="#0063D7" strokeWidth="3" fill="#0063D7" />
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

const EmptyCircle = ({ size = 24, number = 1 }: { size?: number; number?: number }) => (
    <svg height={size} viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" stroke="#0063D7" strokeWidth="3" fill="white" />
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

const SurveyPage: React.FC<RatingProps> = ({ className, count, size, questions, onSubmit }) => {
    const [ratings, setRatings] = useState<number[]>(Array(questions.length).fill(0));

    const handleRatingChange = (index: number, rating: number) => {
        const updatedRatings = [...ratings];
        updatedRatings[index] = rating + 1;
        setRatings(updatedRatings);
    };

    const handleSubmit = () => {
        const hasEmptyResponses = ratings.some((rating) => rating === 0);

        if (hasEmptyResponses) {
            alert("Please answer all the questions before submitting.");
            return;
        }

        const responses: string[][] = questions.map((q, i) => [q, ratings[i].toString()]);
        onSubmit(responses);
    };

    return (
        <div className={`survey-page ${className}`}>
            {questions.map((item, index) => (
                <div key={index} style={{ marginBottom: "20px" }}>
                    <h4>{item}</h4>
                    <div style={{ display: "flex", gap: "8px" }}>
                        {[...Array(count)].map((_, i) => {
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
                </div>
            ))}
            <Button type="PRIMARY" label="Submit Survey" onClick={handleSubmit} />
        </div>
    );
};

export default SurveyPage;
