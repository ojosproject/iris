/**
 * File:     pro/page.tsx
 * Purpose:  Chart page for the Patient Reported Outcomes tool.
 * Authors:  Ojos Project & Iris contributors
 * License:  GNU General Public License v3.0
 */
"use client";
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";
import Chart from "chart.js/auto";
import { invoke } from "@tauri-apps/api/core";
import { sortChartData } from "./_helper";
import Button from "@/components/Button";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { PatientReportedOutcome } from "@/types/pro";
import useKeyPress from "@/components/useKeyPress";
import Layout from "@/components/Layout";

interface ChartData {
  [question: string]: [response: number, recorded_date: Date][];
}

export default function ProChart() {
  const [pros, setPros] = useState<ChartData | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentWeek, setCurrentWeek] = useState(0);
  const router = useRouter();
  const [isSurveyTaken, setIsSurveyTaken] = useState<boolean>(false);
  const minimumButtonWidth = 225;

  useKeyPress("Escape", () => {
    router.back();
  });

  useKeyPress("Enter", () => {
    if (!isSurveyTaken) {
      router.push("./pro/survey");
    }
  });

  useEffect(() => {
    invoke<PatientReportedOutcome[]>("get_all_pros")
      .then((allPros) => {
        const sortedData = sortChartData(allPros);
        setPros(sortedData);
      })
      .catch((error) => {
        console.error("Error fetching PROs data: ", error);
      });
  }, []);

  useEffect(() => {
    setIsSurveyTaken(SurveyTaken());
  }, [pros]);

  const getWeekDates = useCallback(() => {
    const today = new Date();
    const startOfWeek = new Date(
      today.setDate(today.getDate() - today.getDay() + currentWeek * 7),
    );
    return Array.from({ length: 7 }, (_, i) => {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      return day;
    });
  }, [currentWeek]);

  const getOldestWeek = useMemo(() => {
    if (!pros) return 0;

    const allDates: Date[] = [];
    Object.keys(pros).forEach((question) => {
      pros[question].forEach(([_, recordedDate]) => {
        allDates.push(recordedDate);
      });
    });

    const oldestDate = new Date(
      Math.min(...allDates.map((date) => date.getTime())),
    );
    const latestDate = new Date(
      Math.max(...allDates.map((date) => date.getTime())),
    );

    const startOfOldestWeek = new Date(oldestDate);
    const startOfNewestWeek = new Date(latestDate);
    startOfOldestWeek.setDate(oldestDate.getDate() - oldestDate.getDay());
    startOfNewestWeek.setDate(latestDate.getDate() - latestDate.getDay());
    return (
      Math.floor(
        (startOfOldestWeek.getTime() - startOfNewestWeek.getTime()) /
          (7 * 24 * 60 * 60 * 1000),
      ) + 1
    );
  }, [pros]);

  const dayLabels = useMemo(() => {
    const weekDates = getWeekDates();
    return weekDates.map((date) => {
      const dayOfWeek = date.toLocaleString("en-us", { weekday: "long" });
      const monthAndDate = `${date.getMonth() + 1}/${date.getDate()}`;
      return `${dayOfWeek}\n${monthAndDate}`;
    });
  }, [getWeekDates]);

  const dataForCurrentWeek = useMemo(() => {
    if (!pros) return [];

    const questions = Object.keys(pros);
    const currentQuestion = questions[currentQuestionIndex];
    if (!currentQuestion) return [];

    const weekDates = getWeekDates();

    return weekDates.map((date) => {
      const data = pros[currentQuestion]?.find(([_, recordedDate]) => {
        return (
          recordedDate.getFullYear() === date.getFullYear() &&
          recordedDate.getMonth() === date.getMonth() &&
          recordedDate.getDate() === date.getDate()
        );
      });
      return data ? data[0] : null;
    });
  }, [pros, currentQuestionIndex, getWeekDates]);

  useEffect(() => {
    const canvas = document.getElementById(
      "chartCanvas",
    ) as HTMLCanvasElement | null;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const chart = new Chart(ctx, {
      type: "line",
      data: {
        labels: dayLabels,
        datasets: [
          {
            label: "Weekly Data",
            data: dataForCurrentWeek,
            backgroundColor: "#0063d7",
            borderColor: "#0063d7",
            borderWidth: 5,
            spanGaps: true,
            pointBorderWidth: 5,
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
        scales: {
          y: {
            beginAtZero: false,
            min: 0,
            max: 10,
            ticks: {
              stepSize: 1,
            },
          },
        },
      },
      plugins: [ChartDataLabels],
    });

    return () => {
      chart.destroy();
    };
  }, [dataForCurrentWeek]);

  const handlePrevQuestion = () => {
    setCurrentQuestionIndex((prev) => (pros ? Math.max(prev - 1, 0) : prev));
  };

  const handleNextQuestion = () => {
    setCurrentQuestionIndex((prev) => {
      const maxIndex = pros ? Object.keys(pros).length - 1 : 0;
      return Math.min(prev + 1, maxIndex);
    });
  };

  const handlePrevWeek = () => setCurrentWeek((prev) => prev - 1);
  const handleNextWeek = () => setCurrentWeek((prev) => prev + 1);

  const questionKeys = pros ? Object.keys(pros) : [];
  const currentQuestion = questionKeys[currentQuestionIndex];

  const SurveyTaken = () => {
    if (!pros) return false;

    const allDates: Date[] = [];
    Object.keys(pros).forEach((question) => {
      pros[question].forEach(([_, recordedDate]) => {
        allDates.push(recordedDate);
      });
    });

    const latestDate = new Date(
      Math.max(...allDates.map((date) => date.getTime())),
    );
    const today = new Date();

    today.setHours(0, 0, 0, 0);
    latestDate.setHours(0, 0, 0, 0);

    return latestDate.getTime() === today.getTime();
  };

  return (
    <Layout title="Patient Reported Outcomes">
      <div className={styles.container2}>
        {/* Chart Section */}
        <div className={styles.chartContainer}>
          <div className={styles.box}>
            {pros === null ? (
              <p>Loading data...</p>
            ) : (
              <>
                <div className={styles.container2}>
                  <p className={styles.question}>{currentQuestionIndex + 1}. {currentQuestion || "No Question Available"}</p>
                </div>
              </>
            )}
            <canvas
              id="chartCanvas"
              style={{ width: "100%", maxWidth: "100%" }}
            ></canvas>
          </div>
        </div>

        {/* Button Sections Stacked Vertically */}
        <div className={styles.buttonSections}>
          <div className={styles.container4}>
            <Button
              type="SECONDARY"
              label="Previous Week"
              onClick={handlePrevWeek}
              disabled={currentWeek <= getOldestWeek}
              style={{ minWidth: minimumButtonWidth }}
            />
            <Button
              type="SECONDARY"
              label="Next Week"
              onClick={handleNextWeek}
              disabled={currentWeek >= 0}
              style={{ minWidth: minimumButtonWidth }}
            />
          </div>

          <div className={styles.container4}>
            <Button
              type="SECONDARY"
              label="Previous Question"
              onClick={handlePrevQuestion}
              disabled={currentQuestionIndex === 0}
              style={{ minWidth: minimumButtonWidth }}
            />
            <Button
              type="SECONDARY"
              label="Next Question"
              onClick={handleNextQuestion}
              disabled={currentQuestionIndex === questionKeys.length - 1}
              style={{ minWidth: minimumButtonWidth }}
            />
          </div>

          <div className={styles.container4}>
            {isSurveyTaken ? (
              <p>The survey has already been taken today</p>
            ) : (
              <p>Please take the survey for today</p>
            )}
            <Button
              type="PRIMARY"
              label="Take Today's Survey"
              onClick={() => router.push("./pro/survey")}
              // disabled={isSurveyTaken}
              style={{ minWidth: minimumButtonWidth }}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
}
