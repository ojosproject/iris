"use client"
import { useRouter } from "next/navigation";


export default function Main_page() {
    const router = useRouter();
    return (
    <>
        <h1>
            PROs
        </h1>
        <button onClick={() => router.push('/survey')}>
            Take Today's Survey
        </button>
    </>
    );
}