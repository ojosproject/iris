"use client";

import { Resource } from "@/types";
import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import ResourcesView from "./ResourcesView";
import ResourcesNotAvailableView from "./ResourcesNotAvailableView";

export default function Resources() {
  const [resources, setResources] = useState([] as Resource[]);

  useEffect(() => {
    invoke("get_resources").then((r) => {
      setResources(r as Resource[]);
    });
  }, []);

  return resources.length ? (
    <ResourcesView resources={resources} setResources={setResources} />
  ) : (
    <ResourcesNotAvailableView />
  );
}
