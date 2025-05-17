/**
 * File:     BackButton.tsx
 * Purpose:  A universal back button for Iris.
 * Authors:  Ojos Project & Iris contributors
 * License:  GNU General Public License v3.0
 */
"use client";
import { CSSProperties } from "react";
import styles from "./BackButton.module.css";
import { useRouter } from "next/navigation";

interface BackButtonProps {
  onClick?: () => void;
  disabled?: boolean;
  style?: CSSProperties;
  color?: "BLACK" | "WHITE";
}

const BackButton = ({
  onClick,
  disabled,
  style,
  color = "BLACK",
}: BackButtonProps) => {
  const router = useRouter();

  const handleClick = () => {
    if (disabled) return;
    onClick ? onClick() : router.back();
  };

  const iconSrc =
    color === "WHITE"
      ? "/images/chevron-back-outline-white.svg"
      : "/images/chevron-back-outline.svg";

  const buttonStyle: CSSProperties = {
    ...style,
    opacity: disabled ? 0.5 : 1,
    cursor: disabled ? "not-allowed" : "pointer",
  };

  return (
    <img
      src={iconSrc}
      width={50}
      height={50}
      className={styles.backButton}
      style={buttonStyle}
      onClick={handleClick}
      alt="Back"
      draggable={false}
    />
  );
};

export default BackButton;
