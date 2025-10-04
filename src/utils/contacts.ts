import { Contact } from "@/types/contacts";
import { connectUserDB } from "./database";
import { stamp, unix_timestamp } from "./stamp";

export async function getContacts(): Promise<Contact[]> {
  const conn = await connectUserDB();

  const contacts: Contact[] = await conn.select(
    "SELECT * FROM contacts ORDER BY name",
  );

  return contacts;
}

export async function createContact(
  name: string,
  phoneNumber: string | undefined,
  company: string | undefined,
  email: string | undefined,
  contactType: "PATIENT" | "CAREGIVER",
  enabledRelay: boolean,
): Promise<Contact> {
  if (!["PATIENT", "CAREGIVER"].includes(contactType)) {
    console.error(`contactType value '${contactType}' is not valid.`);
  }

  const conn = await connectUserDB();
  const [timestamp, uuid] = await stamp();

  const contact: Contact = {
    id: uuid,
    name,
    phone_number: phoneNumber,
    company,
    email,
    contact_type: contactType,
    enabled_relay: enabledRelay,
    last_updated: timestamp,
  };

  await conn.execute(
    "INSERT INTO contacts(id, name, phone_number, company, email, contact_type, enabled_relay, last_updated) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)",
    [
      contact.id,
      contact.name,
      contact.phone_number,
      contact.company,
      contact.email,
      contact.contact_type,
      +contact.enabled_relay,
      contact.last_updated,
    ],
  );

  return contact;
}

export async function updateContact(
  id: string,
  name: string,
  phoneNumber: string | undefined,
  company: string | undefined,
  email: string | undefined,
  contactType: "PATIENT" | "CAREGIVER",
  enabledRelay: boolean,
): Promise<Contact> {
  if (!["PATIENT", "CAREGIVER"].includes(contactType)) {
    console.error(`contactType value '${contactType}' is not valid.`);
  }

  const conn = await connectUserDB();
  const ts = await unix_timestamp();
  const contact: Contact = {
    id,
    name,
    phone_number: phoneNumber,
    company,
    email,
    contact_type: contactType,
    enabled_relay: enabledRelay,
    last_updated: ts,
  };

  await conn.execute(
    "UPDATE contacts SET name=$2, phone_number=$3, company=$4, email=$5, contact_type=$6, enabled_relay=$7, last_updated=$8 WHERE id=$1",
    [
      contact.id,
      contact.name,
      contact.phone_number,
      contact.company,
      contact.email,
      contact.contact_type,
      contact.enabled_relay,
      contact.last_updated,
    ],
  );

  return contact;
}

export async function getContact(
  id: string,
): Promise<Contact | void | undefined> {
  const conn = await connectUserDB();
  const contacts: Contact[] = await conn.select(
    "SELECT * FROM contacts WHERE id = ?1",
    [id],
  );

  return contacts[0];
}

export async function deleteContact(id: string) {
  const conn = await connectUserDB();
  conn.execute(
    "DELETE FROM contacts WHERE id=?1 AND contact_type != 'PATIENT'",
    [id],
  );
}

export async function getPatientContact(): Promise<Contact> {
  const conn = await connectUserDB();
  const patients: Contact[] = await conn.select(
    "SELECT * FROM contacts WHERE contact_type = 'PATIENT'",
  );

  return patients[0];
}
