"use client";
import { useRouter } from "next/navigation";
import BackButton from "../components/BackButton";
import "./pro.css";

export default function Main_page() {
const router = useRouter();
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
    <div className="container">
        <div className="box">temporary chart</div>
    </div>
    </>
);
}
