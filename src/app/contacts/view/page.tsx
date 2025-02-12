// contacts/view/page.tsx
// Ojos Project

"use client";
import BackButton from "@/app/core/components/BackButton";
import { useRouter, useSearchParams } from "next/navigation";
import classes from "./page.module.css";
import Button from "@/app/core/components/Button";
import { Suspense, useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { Contact } from "../types";
import { timestampToString } from "@/app/core/helper";
import Dialog from "@/app/core/components/Dialog";

/* TODO */