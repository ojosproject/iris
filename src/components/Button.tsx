/**
 * File:     Button.tsx
 * Purpose:  This is a Button component that is styled with the Iris Branding Guidelines.
 * Authors:  Ojos Project & Iris contributors
 * License:  GNU General Public License v3.0
 */
import Link from "next/link";
import styles from "./Button.module.css";
import { CSSProperties, MouseEventHandler } from "react";
import { UrlObject } from "url";

type ButtonProps = {
  type: "PRIMARY" | "SECONDARY" | "DANGER-PRIMARY" | "DANGER-SECONDARY";
  label: string;
  onClick?: MouseEventHandler;
  link?: UrlObject | string;
  disabled?: boolean;
  style?: CSSProperties;
};

export default function Button({
  type,
  label,
  onClick,
  link,
  disabled,
  style,
}: ButtonProps) {
  const buttonStyle: CSSProperties = {
    ...style,
    opacity: disabled ? 0.5 : 1,
    cursor: disabled ? "not-allowed" : "pointer",
  };

  function buttonStyleSelection(): string {
    if (type === "PRIMARY") {
      return styles.buttonIrisPrimary;
    } else if (type === "SECONDARY") {
      return styles.buttonIrisSecondary;
    } else if (type === "DANGER-PRIMARY") {
      return styles.buttonIrisDangerPrimary;
    } else {
      return styles.buttonIrisDangerSecondary;
    }
  }

  return onClick ? (
    <button
      className={buttonStyleSelection()}
      disabled={disabled}
      onClick={!disabled ? onClick : undefined}
      style={buttonStyle}
    >
      {label}
    </button>
  ) : (
    <Link href={disabled ? "#" : link!} passHref>
      <button
        className={buttonStyleSelection()}
        style={buttonStyle}
        disabled={disabled}
      >
        {label}
      </button>
    </Link>
  );
}
