"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import "./pro.css";
import BackButton from "../core/components/BackButton";
import Chart from "chart.js/auto";
import React from "react";
import { invoke } from "@tauri-apps/api/core";
import { sortChartData } from "./helper";
import Button from "../core/components/Button";
import ChartDataLabels from "chartjs-plugin-datalabels";
import ForwardButton from "../core/components/ForwardButton";

interface ProsData {
id: string;
recorded_date: number;
question: string;
response: number;
}

interface ChartData {
[question: string]: [response: number, recorded_date: Date][];
}

export default function MainPage() {
const router = useRouter();
const [pros, setPros] = useState<ChartData | null>(null);
const [charts, setCharts] = useState<{ [key: string]: Chart | null }>({});
const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
const [currentWeek, setCurrentWeek] = useState(0); // 0 for current week, -1 for last week, 1 for next week

useEffect(() => {
    const allPros = [
    // October 2024
    { id: "31", recorded_date: 1696118400, question: "How satisfied are you with the service?", response: 4 },
    { id: "32", recorded_date: 1696204800, question: "How satisfied are you with the service?", response: 5 },
    { id: "33", recorded_date: 1696291200, question: "How satisfied are you with the service?", response: 3 },
    { id: "34", recorded_date: 1696377600, question: "How satisfied are you with the service?", response: 4 },
    { id: "35", recorded_date: 1696464000, question: "How satisfied are you with the service?", response: 6 },
    { id: "36", recorded_date: 1696550400, question: "How satisfied are you with the service?", response: 5 },
    { id: "37", recorded_date: 1696636800, question: "How satisfied are you with the service?", response: 4 },
    { id: "38", recorded_date: 1696723200, question: "How satisfied are you with the service?", response: 5 },
    { id: "39", recorded_date: 1696809600, question: "How satisfied are you with the service?", response: 6 },
    { id: "40", recorded_date: 1696896000, question: "How satisfied are you with the service?", response: 4 },
    { id: "41", recorded_date: 1696982400, question: "How satisfied are you with the service?", response: 3 },
    { id: "42", recorded_date: 1697068800, question: "How satisfied are you with the service?", response: 5 },
    { id: "43", recorded_date: 1697155200, question: "How satisfied are you with the service?", response: 4 },
    { id: "44", recorded_date: 1697241600, question: "How satisfied are you with the service?", response: 6 },
    { id: "45", recorded_date: 1697328000, question: "How satisfied are you with the service?", response: 5 },
    { id: "46", recorded_date: 1697414400, question: "How satisfied are you with the service?", response: 4 },
    { id: "47", recorded_date: 1697500800, question: "How satisfied are you with the service?", response: 5 },
    { id: "48", recorded_date: 1697587200, question: "How satisfied are you with the service?", response: 6 },
    { id: "31", recorded_date: 1696118400, question: "How easy was it to use the app?", response: 4 },
    { id: "32", recorded_date: 1696204800, question: "How easy was it to use the app?", response: 3 },
    { id: "33", recorded_date: 1696291200, question: "How easy was it to use the app?", response: 5 },
    { id: "34", recorded_date: 1696377600, question: "How easy was it to use the app?", response: 4 },
    { id: "35", recorded_date: 1696464000, question: "How easy was it to use the app?", response: 5 },
    { id: "36", recorded_date: 1696550400, question: "How easy was it to use the app?", response: 6 },
    { id: "37", recorded_date: 1696636800, question: "How easy was it to use the app?", response: 4 },
    { id: "38", recorded_date: 1696723200, question: "How easy was it to use the app?", response: 3 },
    { id: "39", recorded_date: 1696809600, question: "How easy was it to use the app?", response: 5 },
    { id: "40", recorded_date: 1696896000, question: "How easy was it to use the app?", response: 4 },
    { id: "41", recorded_date: 1696982400, question: "How likely are you to recommend this app to others?", response: 6 },
    { id: "42", recorded_date: 1697068800, question: "How likely are you to recommend this app to others?", response: 5 },
    { id: "43", recorded_date: 1697155200, question: "How likely are you to recommend this app to others?", response: 6 },
    { id: "44", recorded_date: 1697241600, question: "How likely are you to recommend this app to others?", response: 4 },
    { id: "45", recorded_date: 1697328000, question: "How likely are you to recommend this app to others?", response: 5 },
    { id: "46", recorded_date: 1697414400, question: "How likely are you to recommend this app to others?", response: 3 },
    { id: "47", recorded_date: 1697500800, question: "How likely are you to recommend this app to others?", response: 4 },
    { id: "48", recorded_date: 1697587200, question: "How likely are you to recommend this app to others?", response: 6 },
    ];
    const sortedData = sortChartData(allPros);
    console.log("sortedData: ", sortedData);
    setPros(sortedData);
    // invoke<ProsData[]>("get_all_pros")
    //   .then((allPros) => {
    //     const sortedData = sortChartData(allPros);
    //     setPros(sortedData);
    //   })
    //   .catch((error) => {
    //     console.error("Error fetching PROs data: ", error);
    //   });
}, []);

// Generate charts
useEffect(() => {
    if (pros) {
        const questionList = Object.keys(pros);
        const question = questionList[currentQuestionIndex];
        const canvasId = `chart-${question}`;
        const canvas = document.getElementById(canvasId) as HTMLCanvasElement;

        if (charts[question]) {
            charts[question]?.destroy();
        }

        // Get the data for the current week
        const dataForCurrentWeek = pros[question].slice(currentWeek * 7, currentWeek * 7 + 7);

        const fullWeekData = [];
        const dayLabels = [];

        for (let i = 0; i < 7; i++) {
            const dataForDay = dataForCurrentWeek[i];
            const date = new Date((currentWeek * 7 + i) * 86400000);
            const dayOfWeek = date.toLocaleString("en-us", { weekday: "long" });
            const monthAndDate = `${date.getMonth() + 1}/${date.getDate()}`;
            dayLabels.push(`${dayOfWeek}\n${monthAndDate}`);

            // If data for the day exists, push the response; otherwise, push 0
            if (dataForDay) {
                fullWeekData.push(dataForDay[0]);
            } else {
                fullWeekData.push(null);
            }
        }

        const newChart = new Chart(canvas, {
            type: "bar",
            data: {
                labels: dayLabels,
                datasets: [
                    {
                        label: question,
                        data: fullWeekData,
                        backgroundColor: "#0063d7",
                        borderColor: "#0063d7",
                        borderWidth: 1,
                    },
                ],
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { display: false },
                    title: { display: true, text: question },
                    datalabels: {
                        display: true,
                        align: "end",
                        anchor: "start",
                        color: "white",
                        font: {
                            weight: "bold",
                            size: 14,
                        },
                        formatter: (value) => value,
                    },
                },
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: "Days of the Week",
                        },
                    },
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: "Responses",
                        },
                    },
                },
            },
            plugins: [ChartDataLabels],
        });

        setCharts((prev) => ({ ...prev, [question]: newChart }));
    }
}, [pros, currentQuestionIndex, currentWeek]);


const handlePrevWeek = (): void => setCurrentWeek((prev) => Math.max(prev - 1, -1)); // Min -1 (no previous week)

const handleNextWeek = (): void => setCurrentWeek((prev) => Math.min(prev + 1, 1)); // Max 1 (no next week)

const handlePrevQuestion = (): void => {
    setCurrentQuestionIndex((prev) => Math.max(0, prev - 1));
};

const handleNextQuestion = (): void => {
    setCurrentQuestionIndex((prev) =>
        Math.min(Object.keys(pros || {}).length - 1, prev + 1)
    );
};

return (
    <>
        <BackButton />
        <h1>PROs</h1>
        <div className="container">
            <Button type="PRIMARY" label="Take Today's Survey" onClick={() => router.push("./pro/survey")} />
        </div>
        <div className="box">

            <div className="charts-container">
                {pros ? (
                    <>
                        <div className="chart-nav">
                            <p>{`${Object.keys(pros)[currentQuestionIndex]}`}</p>
                            <div className="container-3">
                                <BackButton onClick={handlePrevWeek}
                                style={{
                                    backgroundColor: "navy",
                                    width: "60px",
                                    height: "60px", 
                                    borderRadius: "50%",
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                }}
                                />
                                <ForwardButton
                                onClick={handleNextWeek}
                                style={{
                                    backgroundColor: "navy",
                                    width: "60px",
                                    height: "60px", 
                                    borderRadius: "50%",
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                }}
                                />
                            </div>
                        </div>
                        <div key={Object.keys(pros)[currentQuestionIndex]} className="chart-item">
                            <canvas
                                id={`chart-${Object.keys(pros)[currentQuestionIndex]}`}
                                width="400"
                                height="400"
                            ></canvas>
                        </div>
                    </>
                ) : (
                    <p>Loading...</p>
                )}
            </div>

            <div className="container-2">
                <Button type="SECONDARY" label="Previous Question" onClick={handlePrevQuestion} />
                <Button type="SECONDARY" label="Next Question" onClick={handleNextQuestion} />
            </div>
        </div>
    </>
    );
}
