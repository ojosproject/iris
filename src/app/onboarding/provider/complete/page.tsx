import Layout from "@/components/Layout";
import Link from "next/link";

export default function Page() {
  return (
    <Layout title="Provider setup complete" disabledBackButton={true}>
      <p>You're completed the setup.</p>
      <Link href="/onboarding">
        <button className="primary">Go to patient onboarding</button>
      </Link>
    </Layout>
  );
}
