import { Resource } from "@/app/core/types";
import CategoryMenu from "./components/CategoryMenu";
import classes from "./page.module.css";
import ResourcesList from "./components/ResourcesList";
import BackButton from "../core/components/BackButton";
import { useEffect, useState } from "react";

export default function ResourcesView(props: {
  resources: Resource[];
  setResources: Function;
}) {
  const [categories, setCategories] = useState(["all"]);

  useEffect(() => {
    setCategories(
      categories.concat(
        props.resources
          .map((resource) => resource.category.toLowerCase())
          .filter((category, index, array) => array.indexOf(category) === index)
          .sort((a, b) => a.localeCompare(b)),
      ),
    );
  }, []);

  return (
    <>
      <BackButton />
      <header className={classes.header}>
        <h1>Resources</h1>
      </header>

      <div className={classes.menu_and_resources_container}>
        <CategoryMenu
          labels={categories}
          resources={props.resources}
          setResources={props.setResources}
        />
        <ResourcesList
          resources={props.resources}
          setResources={props.setResources}
        />
      </div>
    </>
  );
}
