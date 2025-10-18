import Layout from "@/components/Layout";
import SelectableItem from "../../_components/SelectableItem";
import styles from "./page.module.css";
import Link from "next/link";

export default function Page() {
  return (
    <Layout title="Allowed features">
      <SelectableItem
        selected={true}
        title="Medications"
        description="Keep track of your medications."
      ></SelectableItem>
      <SelectableItem
        selected={false}
        title="Care Instructions"
        description="Keep some instructions around for the nurses or other caregivers."
      />
      <div className={styles.buttons}>
        <Link href="/onboarding/provider/contacts">
          <button className="primary">Continue</button>
        </Link>
      </div>
    </Layout>
  );
}
