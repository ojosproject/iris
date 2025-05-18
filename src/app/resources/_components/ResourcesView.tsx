/**
 * File:     ResourcesView.tsx
 * Purpose:  The actual resources page if the database includes any.
 * Authors:  Ojos Project & Iris contributors
 * License:  GNU General Public License v3.0
 */
import { Resource } from "@/types/resources";
import CategoryMenu from "./CategoryMenu";
import styles from "../page.module.css";
import ResourcesList from "./ResourcesList";
import BackButton from "@/components/BackButton";
import { useEffect, useState } from "react";

type ResourcesViewProps = {
  resources: Resource[];
  setResources: (resources: Resource[]) => void;
};

export default function ResourcesView({
  resources,
  setResources,
}: ResourcesViewProps) {
  const [categories, setCategories] = useState(["all"]);

  useEffect(() => {
    setCategories(
      categories.concat(
        resources
          .map((resource) => resource.category.toLowerCase())
          .filter((category, index, array) => array.indexOf(category) === index)
          .sort((a, b) => a.localeCompare(b)),
      ),
    );
  }, []);

  return (
    <>
      <BackButton />
      <header className={styles.header}>
        <h1>Resources</h1>
      </header>

      <div className={styles.menuAndResourcesContainer}>
        <div className={styles.sticky}>
          <CategoryMenu labels={categories} setResources={setResources} />
        </div>

        <ResourcesList resources={resources} />
      </div>
    </>
  );
}
