"use client";

import { useRouter } from "next/navigation";
import "./returnButton.css";

export default function ReturnButton() {
  const router = useRouter();
  return <button onClick={() => router.back()}>Return to Menu</button>;
}
