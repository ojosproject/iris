"use client";
import { CSSProperties } from "react";
import classes from "./BackButton.module.css";
import { useRouter } from "next/navigation";

export default function BackButton(props: {
  onClick?: Function;
  style?: CSSProperties;
  color?: "BLACK" | "WHITE";
}) {
  const router = useRouter();
  return (
    <img
      onClick={() => (props.onClick ? props.onClick() : router.back())}
      src={
      props.color === "WHITE"
      ? "/images/chevron-back-outline-white.svg"
      : "/images/chevron-back-outline.svg"
      }
      width={50}
      height={50}
      className={classes.BackButton}
      style={props.style}
    />
  );
}
