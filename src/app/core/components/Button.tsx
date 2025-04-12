// Button.tsx
// Ojos Project
//
// This is a Button component that is styled with the Iris Branding Guidelines.

import Link from "next/link";
import classes from "./Button.module.css";
import { CSSProperties, MouseEventHandler } from "react";
import { UrlObject } from "url";

export default function Button(props: {
  type: "PRIMARY" | "SECONDARY" | "DANGER-PRIMARY" | "DANGER-SECONDARY";
  label: string;
  onClick?: MouseEventHandler;
  link?: UrlObject | string;
  disabled?: boolean;
  style?: CSSProperties;
}) {
  const buttonStyle: CSSProperties = {
    ...props.style,
    opacity: props.disabled ? 0.5 : 1,
    cursor: props.disabled ? "not-allowed" : "pointer",
  };

  function buttonStyleSelection(): string {
    if (props.type === "PRIMARY") {
      return classes.button_iris_primary;
    } else if (props.type === "SECONDARY") {
      return classes.button_iris_secondary;
    } else if (props.type === "DANGER-PRIMARY") {
      return classes.button_iris_danger_primary;
    } else {
      return classes.button_iris_danger_secondary;
    }
  }

  return props.onClick ? (
    <button
      className={buttonStyleSelection()}
      disabled={props.disabled}
      onClick={!props.disabled ? props.onClick : undefined}
      style={buttonStyle}
    >
      {props.label}
    </button>
  ) : (
    <Link href={props.disabled ? "#" : props.link!} passHref>
      <button
        className={buttonStyleSelection()}
        style={buttonStyle}
        disabled={props.disabled}
      >
        {props.label}
      </button>
    </Link>
  );
}
