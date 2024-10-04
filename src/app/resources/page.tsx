import classes from "./page.module.css";
import BackButton from "../call/recordings/components/backButton";
import CategoryMenu from "./components/CategoryMenu";
import ResourcesList from "./components/ResourcesList";

export default function Resources() {
  return (
    <>
      <BackButton />
      <header className={classes.header}>
        <h1>Resources</h1>
      </header>

      <div className={classes.menu_and_resources_container}>
        <CategoryMenu labels={["All", "Financial", "Informational"]} />
        <ResourcesList />
      </div>
    </>
  );
}
