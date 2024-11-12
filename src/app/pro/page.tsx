"use client"
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import "./pro.css";

export default function Main_page() {
    const router = useRouter();
    return (
    <>
        <button className="pro_button_1" onClick={() => router.push("./")}>
            <FontAwesomeIcon icon={faArrowLeft} />
        </button>
        <h1>
            PROs
        </h1>
        <div className="container">
            <button className="pro_button_2" onClick={() => router.push("./pro/survey")}>
                Take Today's Survey
            </button>
        </div>
        <div className="container">
            <div className="box">
                temporary chart
            </div>
        </div>
    </>
    );
}