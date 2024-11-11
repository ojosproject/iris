"use client";
import classes from "./BackButton.module.css";
import { useRouter } from "next/navigation";

export default function BackButton() {
  const router = useRouter();
  return (
    <img
      onClick={() => router.back()}
      src="/images/chevron-back-outline.svg"
      width={50}
      height={50}
      className={classes.BackButton}
    />
  );
}
