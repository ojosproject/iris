import styles from "./SelectableItem.module.css";

type SelectableItemProp = {
  selected: boolean;
};

export default function SelectableItem({}) {
  return <li className={styles.longItem}></li>;
}
