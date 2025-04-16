"use client";
import { CSSProperties } from "react";
import classes from "./BackButton.module.css";
import { useRouter } from "next/navigation";

interface BackButtonProps {
  onClick?: () => void;
  disabled?: boolean;
  style?: CSSProperties;
  color?: "BLACK" | "WHITE";
}

const BackButton = ({ onClick, disabled, style, color = "BLACK" }: BackButtonProps) => {
  const router = useRouter();

  const handleClick = () => {
    if (disabled) return;
    onClick ? onClick() : router.back();
  };

  const iconSrc = color === "WHITE"
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
      className={classes.BackButton}
      style={buttonStyle}
      onClick={handleClick}
      alt="Back"
    />
  );
};

export default BackButton;
