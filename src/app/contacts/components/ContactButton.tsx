// ContactButton.tsx
// Ojos Project
import { Contact } from "../types";
import classes from "./ContactButton.module.css";
import Link from "next/link";

export default function ContactButton(props: { contact: Contact }) {
  return (
    <Link
      style={{ color: "black", textDecoration: "none" }}
      href={{
        pathname: "./contacts/view",
        query: { id: props.contact.id },
      }}
    >
      <div className={classes.single_contact}>
        <h3>{`Name: ${props.contact.name}`}</h3>
        <p>{`Phone Number: ${props.contact.phone_number}`}</p>
        <p>{`Email: ${props.contact.email}`}</p>
        <p>{`Company: ${props.contact.company}`}</p>
      </div>
    </Link>
  );
}
