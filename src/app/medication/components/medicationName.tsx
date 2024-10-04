import { useRouter } from "next/router";
import classes from "./medicationName.module.css";
import { Medication } from "@/types";

export default function obtainName() {
  const router = useRouter();
  const { medication_name, given_dose, last_taken } = router.query;
  return (
    //medication with name, dose, and last taken
  );

}
