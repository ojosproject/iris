"use client"
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

export default function Survey() {
    const router = useRouter();
    return (
    <>
        <button onClick={() => router.back()}>
            <FontAwesomeIcon icon={faArrowLeft} />
        </button>
        <h1>
            Today's Survey
        </h1>
    </>
    );
}