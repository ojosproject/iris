import { Resource } from "@/types";
import BackButton from "../call/recordings/components/backButton";
import CategoryMenu from "./components/CategoryMenu";
import classes from "./page.module.css";
import ResourcesList from "./components/ResourcesList";

export default function ResourcesView(props: {
  resources: Resource[];
  setResources: Function;
}) {
  return (
    <>
      <BackButton />
      <header className={classes.header}>
        <h1>Resources</h1>
      </header>

      <div className={classes.menu_and_resources_container}>
        <CategoryMenu
          labels={["All", "Financial", "Informational"]}
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
