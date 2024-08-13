"use client";
import classes from "./controls.module.css";

export default function Controls() {
  return (
    <div className={classes.controls}>
      <button> End </button>
      <button> Mic </button>
      <button> Camera </button>
      <button> Record </button>
    </div>
  );
}
