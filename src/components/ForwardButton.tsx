/**
 * File:     ForwardButton.tsx
 * Purpose:  A universal forward button.
 * Authors:  Ojos Project & Iris contributors
 * License:  GNU General Public License v3.0
 */
"use client";
import { CSSProperties } from "react";
import styles from "./ForwardButton.module.css";

type ForwardButtonProps = {
  onClick: () => void;
  style?: CSSProperties;
  disabled?: boolean;
  color?: "BLACK" | "WHITE";
};

export default function ForwardButton({
  onClick,
  style,
  disabled,
  color,
}: ForwardButtonProps) {
  const handleClick = () => {
    if (disabled) {
      return;
    }
    if (onClick) {
      onClick();
    }
  };

  const buttonStyle: CSSProperties = {
    ...style,
    opacity: disabled ? 0.5 : 1,
    cursor: disabled ? "not-allowed" : "pointer",
  };

  const iconSrc =
    color === "WHITE"
      ? "/images/ionic/chevron-forward-outline-white.svg"
      : "/images/ionic/chevron-forward-outline.svg";

  return (
    <img
      onClick={handleClick}
      src={iconSrc}
      width={50}
      height={50}
      className={styles.forwardButton}
      style={buttonStyle}
      alt="Forward"
      draggable={false}
    />
  );
}
