/**
 * File:     MedicationIconPicker.tsx
 * Purpose:  Component to select an icon for a medication.
 * Authors:  Ojos Project & Iris contributors
 * License:  GNU General Public License v3.0
 */
import styles from "./MedicationIconPicker.module.css";
import Image from "next/image";

type MedicationPickerProps = {
  medium: string;
  selectedIcon: string;
  onSelect: Function;
};

export default function MedicationPicker({
  medium,
  selectedIcon,
  onSelect,
}: MedicationPickerProps) {
  return (
    <div className={styles.iconGroup}>
      {[
        "blue",
        "dgray",
        "gold",
        "gray",
        "green",
        "orange",
        "purple",
        "red",
        "white",
        "yellow",
      ].map((color) => {
        return (
          <button
            key={`${medium}-${color}-button`}
            className={
              selectedIcon === `${medium}-${color}.svg`
                ? styles.iconButtonSelected
                : styles.iconButton
            }
            onClick={() => {
              onSelect(`${medium}-${color}.svg`);
            }}
          >
            <Image
              src={`/images/medication-icons/${medium}-${color}.svg`}
              alt={`Icon for ${medium} with a ${color} background.`}
              width={80}
              height={80}
              draggable={false}
            />
          </button>
        );
      })}
    </div>
  );
}
