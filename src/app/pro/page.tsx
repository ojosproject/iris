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

interface PatientReportedOutcome {
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
    invoke<PatientReportedOutcome[]>("get_all_pros")
    .then((allPros) => {
        const sortedData = sortChartData(allPros);
        setPros(sortedData);
        console.log("sorted data: ", sortedData);
    })
    .catch((error) => {
        console.error("Error fetching PROs data: ", error);
    });
}, []);

// Generate charts
useEffect(() => {
    if (pros && Object.keys(pros).length > 0) {
        const questionList = Object.keys(pros);
        const question = questionList[currentQuestionIndex];
        const canvasId = `chart-${question}`;
        const canvas = document.getElementById(canvasId) as HTMLCanvasElement;

        if (charts[question]) {
            charts[question]?.destroy();
        }
        console.log("Questions with pros: ", pros[question])
        // Get the data for the current week
        const dataForCurrentWeek = pros[question].slice(currentWeek * 7, currentWeek * 7 + 7);
        const fullWeekData = [];
        const dayLabels = [];

        // Generate array of dates for the current week (from Sunday to Saturday)
        // source: https://stackoverflow.com/questions/70073988/how-to-get-the-all-the-dates-of-the-current-week/70074156
        const arrayDate = Array.from(Array(7).keys()).map((idx) => {
            const d = new Date();
            d.setDate(d.getDate() - d.getDay() + idx); 
            return d;
        });

        console.log("arrayDate: ", arrayDate);

        for (let i = 0; i < 7; i++) {
            const date = arrayDate[i];
            const dataForDay = dataForCurrentWeek[i];
            if (dataForDay !== null ) {
                console.log("dataForDay: ", dataForDay);
                console.log("dataforweek: ", dataForCurrentWeek);
                // Convert timestamp to a Date object
                const dataDayDate = new Date(dataForDay[1]);
                console.log("dataDayDate: ", dataDayDate);
                // Compare only the date part and no time
                // console.log("date getfullyear: ", date.getFullYear())
                // console.log("date getmonth: ", date.getMonth())
                // console.log("date getday: ", date.getDate())
                // console.log("datedaydate getfullyear: ", dataDayDate.getFullYear())
                // console.log("datedaydate getmonth: ", dataDayDate.getMonth())
                // console.log("datedaydate getday: ", dataDayDate.getDate())
                const sameDay = date.getFullYear() === dataDayDate.getFullYear() &&
                                date.getMonth() === dataDayDate.getMonth() &&
                                date.getDate() === dataDayDate.getDate();
    
                console.log("Date comparison (sameDay): ", sameDay);
                
                // Format day and month
                const dayOfWeek = date.toLocaleString("en-us", { weekday: "long" });
                const monthAndDate = `${date.getMonth() + 1}/${date.getDate()}`;
                console.log("Month and Date: ", monthAndDate);
                
                dayLabels.push(`${dayOfWeek}\n${monthAndDate}`);
    
                // If data for the day exists and the date matches
                // push the response else push null
                if (dataForDay && sameDay) {
                    fullWeekData.push(dataForDay[0]);
                } else {
                    fullWeekData.push(null);
                }
            }
        }

        console.log("Full Week Data: ", fullWeekData);


        const newChart = new Chart(canvas, {
            type: "bar",
            data: {
                labels: dayLabels,
                datasets: [
                    {
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
                                color="WHITE"
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
                                color="WHITE"
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
