"use client";

import classes from "./page.module.css";
import BackButton from "../call/recordings/components/backButton";
import CategoryMenu from "./components/CategoryMenu";
import ResourcesList from "./components/ResourcesList";
import { Resource } from "@/types";
import { useState } from "react";

export default function Resources() {
  const [resources, setResources] = useState([] as Resource[]);
  return (
    <>
      <BackButton />
      <header className={classes.header}>
        <h1>Resources</h1>
      </header>

      <div className={classes.menu_and_resources_container}>
        <CategoryMenu
          labels={["All", "Financial", "Informational"]}
          resources={resources}
          setResources={setResources}
        />
        <ResourcesList resources={resources} setResources={setResources} />
      </div>
    </>
  );
}
