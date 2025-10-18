import Layout from "@/components/Layout";
import styles from "./page.module.css";
import Link from "next/link";

export default function Page() {
  return (
    <Layout title="Contacts">
      <section className={styles.infoAndIcon}>
        <div className={styles.info}>
          <h2>Staff contact information</h2>
          <p>
            Patients or caregivers could benefit from having staff's work
            contact information. If your organization has this information, add
            them here.
          </p>

          <label>
            Name
            <input type="text" />
          </label>
          <label>
            Phone number
            <input type="text" />
          </label>
          <label>
            Company
            <input type="text" />
          </label>
        </div>
        <img
          src={"/images/ionic/person-circle-outline.svg"}
          alt="Person icon"
          className={styles.icon}
        />
      </section>
      <div className={styles.buttons}>
        <div>
          <button className="primary">Add contact</button>
          <Link href="/onboarding/provider/complete">
            <button className="secondary">Skip</button>
          </Link>
        </div>
      </div>
    </Layout>
  );
}
