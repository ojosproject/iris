import styles from "./SelectableItem.module.css";

type SelectableItemProp = {
  selected: boolean;
  title: string;
  description: string;
};

export default function SelectableItem({
  selected,
  title,
  description,
}: SelectableItemProp) {
  return (
    <li
      className={
        selected ? styles.longItemSelected : styles.longItemNotSelected
      }
    >
      <span className={styles.text}>
        <p>
          <strong>{title}.</strong> {description}
        </p>
      </span>
    </li>
  );
}
