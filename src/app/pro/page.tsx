"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import "./pro.css";
import BackButton from "../core/components/BackButton";
import Chart from "chart.js/auto";
import React from "react";
import { invoke } from "@tauri-apps/api/core";

interface ProsData {
    id: string;
    recorded_date: number;
    question: string;
    response: number;
}

export default function MainPage() {
    const router = useRouter();
    const [pros, setPros] = React.useState<ProsData[]>([]);
    // Correct the state type here to store Chart instances
    const [charts, setCharts] = React.useState<{ [key: string]: Chart | null }>({}); 

    useEffect(() => {
        // Fetch the data
        invoke<ProsData[]>('get_all_pros')
            .then((allPros) => {
                console.log("Fetched PROs data: ", allPros);
                setPros(allPros || []);
            })
            .catch((error) => {
                console.error("Error fetching PROs data: ", error);
            });
    }, []);

    // Generate charts per question
    useEffect(() => {
        if (pros.length > 0) {
            // Group responses by question
            const groupedData = pros.reduce<Record<string, number[]>>((acc, item) => {
                if (!acc[item.question]) {
                    acc[item.question] = [];
                }
                acc[item.question].push(item.response);
                return acc;
            }, {});

            // Create a chart for each question
            Object.keys(groupedData).forEach((question) => {
                const canvasId = `chart-${question}`;
                const canvas = document.getElementById(canvasId) as HTMLCanvasElement;

                if (canvas) {
                    // Destroy previous chart if it exists
                    if (charts[question]) {
                        charts[question]?.destroy();
                    }

                    // Create new chart
                    const newChart = new Chart(canvas, {
                        type: "bar",
                        data: {
                            labels: groupedData[question].map((_, i) => `Response ${i + 1}`),
                            datasets: [
                                {
                                    label: question,
                                    data: groupedData[question],
                                    backgroundColor: "rgba(0, 99, 215, 0.6)",
                                    borderColor: "rgba(0, 99, 215, 1)",
                                    borderWidth: 1,
                                },
                            ],
                        },
                        options: {
                            responsive: true,
                            plugins: {
                                legend: { display: false },
                                title: { display: true, text: question },
                            },
                            scales: {
                                y: { beginAtZero: true },
                            },
                        },
                    });

                    // Store the chart instance in state
                    setCharts((prev) => ({ ...prev, [question]: newChart }));
                }
            });
        }
    }, [pros]); // Dependency ensures this runs when `pros` updates

    return (
        <>
            <BackButton />
            <h1>PROs</h1>
            <div className="container">
                <button
                    className="pro_button_2"
                    onClick={() => router.push("./pro/survey")}
                >
                    Take Today's Survey
                </button>
            </div>
            {/* Render charts dynamically */}
            <div className="charts-container">
                {pros.length > 0 &&
                    [pros.map((item) => item.question)].map((question) => (
                        <div key={question} className="chart-item">
                            <canvas id={`chart-${question}`} width="400" height="400"></canvas>
                        </div>
                    ))}
            </div>
        </>
    );
}
