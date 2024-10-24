"use client"
import "./survey.css";
import { useRouter } from "next/navigation";

export default function Main_page() {
    const router = useRouter();
    return (
    <>
        <h1>
            PROs
        </h1>
        <div className="container">
            <button onClick={() => router.push('/survey')}>
                Take Today's Survey
            </button>
        </div>
    </>
    );
}