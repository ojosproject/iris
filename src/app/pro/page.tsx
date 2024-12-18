"use client";
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import "./pro.css";
import Chart from "chart.js/auto";
import { invoke } from "@tauri-apps/api/core";
import { sortChartData } from "./helper";
import Button from "../core/components/Button";
import ChartDataLabels from "chartjs-plugin-datalabels";
import BackButton from "../core/components/BackButton";
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

const ProChart = () => {
  const [pros, setPros] = useState<ChartData | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentWeek, setCurrentWeek] = useState(0);
  const [counter, setCounter] = useState(0);
  const router = useRouter();

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
    return Math.floor(
      (startOfOldestWeek.getTime() - startOfNewestWeek.getTime()) /
        (7 * 24 * 60 * 60 * 1000),
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
    console.log("week: ", weekDates);

    return weekDates.map((date) => {
      const data = pros[currentQuestion]?.find(([_, recordedDate]) => {
        return (
          recordedDate.getFullYear() === date.getFullYear() &&
          recordedDate.getMonth() === date.getMonth() &&
          recordedDate.getDate() === date.getDate()
        );
      });
      return data ? data[0] : 0;
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
      type: "bar",
      data: {
        labels: dayLabels,
        datasets: [
          {
            label: "Weekly Data",
            data: dataForCurrentWeek,
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

  console.log("current week: ", currentWeek);
  console.log("oldest week: ", getOldestWeek);

  return (
    <>
      <BackButton />
      <h1>Patient Reported Outcomes (PROs)</h1>
      <div className="container">
        <Button
          type="PRIMARY"
          label="Take Today's Survey"
          onClick={() => router.push("./pro/survey")}
        />
      </div>

      <div className="box">
        {pros === null ? (
          <p>Loading data...</p>
        ) : (
          <>
            <div className="container-2">
              <p>{currentQuestion || "No Question Available"}</p>
              <div className="container-3">
                <BackButton
                  onClick={handlePrevWeek}
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
                  disabled={currentWeek <= getOldestWeek}
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
                  disabled={currentWeek >= 0}
                />
              </div>
            </div>
            <div className="container">
              <canvas
                id="chartCanvas"
                style={{ width: "100%", maxWidth: "100%" }}
              ></canvas>
            </div>

            <div className="container-2">
              <Button
                type="SECONDARY"
                label="Previous Question"
                onClick={handlePrevQuestion}
                disabled={currentQuestionIndex === 0}
              />

              <Button
                type="SECONDARY"
                label="Next Question"
                onClick={handleNextQuestion}
                disabled={currentQuestionIndex === questionKeys.length - 1}
              />
            </div>
          </>
        )}
      </div>
    </>
  );
};
export default ProChart;
