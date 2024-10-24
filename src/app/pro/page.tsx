"use client"
import "./pro.css";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

export default function Main_page() {
    const router = useRouter();
    return (
    <>
        <button onClick={() => router.back()}>
            <FontAwesomeIcon icon={faArrowLeft} />
        </button>
        <h1>
            PROs
        </h1>
        <div className="container">
            <button onClick={() => router.push('/survey')}>
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