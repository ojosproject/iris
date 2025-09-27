/**
 * File:     settings/layout.tsx
 * Purpose:  Unique layout for pages related to Settings.
 * Authors:  Ojos Project & Iris contributors
 * License:  GNU General Public License v3.0
 */
"use client";
import Layout from "@/components/Layout";
import { ReactNode } from "react";
import styles from "./page.module.css";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";

export default function SettingsLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const location = usePathname();

  function dictateStyle(
    url: string,
    location: string,
  ): "primary" | "secondary" {
    return url.includes(location) ? "primary" : "secondary";
  }

  function Menu() {
    return (
      <nav className={styles.menuContainer}>
        <Link href="/settings/device">
          <button
            style={{ width: "100%" }}
            className={dictateStyle(location, "/device")}
          >
            Device
          </button>
        </Link>
        <Link href="/settings/software">
          <button
            className={dictateStyle(location, "/software")}
            style={{ width: "100%" }}
          >
            Software
          </button>
        </Link>
        <Link href="/settings/data">
          <button
            className={dictateStyle(location, "/data")}
            style={{ width: "100%" }}
          >
            Your data
          </button>
        </Link>
      </nav>
    );
  }

  return (
    <Layout
      title="Settings"
      handleBackClick={() => {
        router.push("/");
      }}
    >
      <section className={styles.menuAndContent}>
        <Menu />
        {children}
      </section>
    </Layout>
  );
}
