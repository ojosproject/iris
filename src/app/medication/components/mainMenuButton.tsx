import Link from "next/link";
import "./mainMenuButton.css"; // Import medView.css directly

export default function MainMenuButton() {
  return (
    <Link href="/">
      <button className="back">Back</button>
    </Link>
  );
}
