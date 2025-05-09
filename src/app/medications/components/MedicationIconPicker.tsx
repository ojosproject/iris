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
    <div className={styles.icon_group}>
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
                ? styles.icon_button_selected
                : styles.icon_button
            }
            onClick={() => {
              onSelect(`${medium}-${color}.svg`);
            }}
          >
            <Image
              src={`/images/${medium}-${color}.svg`}
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
