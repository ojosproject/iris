"use client";

import { Resource } from "./types";
import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import ResourcesView from "./ResourcesView";
import ResourcesNotAvailableView from "./ResourcesNotAvailableView";
import useKeyPress from "../accessibility/keyboard_nav";
import { useRouter } from "next/navigation";

export default function Resources() {
  const [resources, setResources] = useState<Resource[]>([]);
  const router = useRouter();

  useKeyPress("Escape", () => {
    router.back();
  });

  useEffect(() => {
    invoke<Resource[]>("get_resources").then((r) => {
      setResources(r);
    });
  }, []);

  return resources.length ? (
    <ResourcesView resources={resources} setResources={setResources} />
  ) : (
    <ResourcesNotAvailableView />
  );
}
