'use client';

import { useRouter } from "next/navigation";
import classes from "./backButton.module.css";

export default function BackButton() {
    const router = useRouter();
    return (
        <button onClick={() => router.back()}>
            Back
        </button>
    );
}