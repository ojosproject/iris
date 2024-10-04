import Link from "next/link";
import "./returnButton.css"; // Import medView.css directly

export default function MedicationLogButton() {
  return (
    <Link
      href={{
        pathname: "/medication/",
      }}
    >
      <button className="back">Back</button>
    </Link>
  );
}
