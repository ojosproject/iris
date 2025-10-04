/**
 * File:     resources/page.tsx
 * Purpose:  Forwards to ResourcesView or ResourcesNotAvailableView.
 * Authors:  Ojos Project & Iris contributors
 * License:  GNU General Public License v3.0
 */
"use client";
import { Resource } from "@/types/resources";
import { useEffect, useState } from "react";
import ResourcesView from "./_components/ResourcesView";
import ResourcesNotAvailableView from "./_components/ResourcesNotAvailableView";
import useKeyPress from "@/components/useKeyPress";
import { useRouter } from "next/navigation";
import Layout from "@/components/Layout";
import { getResources } from "@/utils/resources";

export default function Resources() {
  const [resources, setResources] = useState<Resource[]>([]);
  const router = useRouter();

  useKeyPress("Escape", () => {
    router.push("/");
  });

  useEffect(() => {
    async function initPage() {
      const r = await getResources();
      setResources(r);
    }

    initPage();
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
