/**
 * File:     resources/page.tsx
 * Purpose:  Forwards to ResourcesView or ResourcesNotAvailableView.
 * Authors:  Ojos Project & Iris contributors
 * License:  GNU General Public License v3.0
 */
"use client";
import { Resource } from "@/types/resources";
import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import ResourcesView from "./_components/ResourcesView";
import ResourcesNotAvailableView from "./_components/ResourcesNotAvailableView";
import useKeyPress from "@/components/useKeyPress";
import { useRouter } from "next/navigation";
import Layout from "@/components/Layout";

export default function Resources() {
  const [resources, setResources] = useState<Resource[]>([]);
  const router = useRouter();

  useKeyPress("Escape", () => {
    router.push("/");
  });

  useEffect(() => {
    invoke<Resource[]>("get_resources").then((r) => {
      setResources(r);
    });
  }, []);

  return (
    <Layout title="Resources">
      {resources.length ? (
        <ResourcesView resources={resources} setResources={setResources} />
      ) : (
        <ResourcesNotAvailableView />
      )}
    </Layout>
  );
}
