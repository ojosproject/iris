/**
 * File:     ResourcesList.tsx
 * Purpose:  Returns a pretty list of resources.
 * Authors:  Ojos Project & Iris contributors
 * License:  GNU General Public License v3.0
 */
"use client";
import { Resource } from "@/types/resources";
import styles from "./ResourcesList.module.css";
import QRCode from "react-qr-code";
import { timestampToString } from "@/utils/parsing";

type ResourcesListProps = {
  resources: Resource[];
};

type ResourceProps = {
  resource: Resource;
};

export default function ResourcesList({ resources }: ResourcesListProps) {
  function Resource({ resource }: ResourceProps) {
    return (
      <div className={styles.resourceContainer}>
        <div className={styles.resourceTextContent}>
          <h2>{resource.label}</h2>
          <h4 className={styles.shortenLineText}>{resource.organization}</h4>
          <p className={styles.categoryLabel + " " + styles.shortenLineHeight}>
            {resource.category.toLowerCase()}
          </p>

          <p className={styles.shortenLineHeight}>{resource.description}</p>
        </div>
        <div className={styles.QrCodeContainer}>
          <p className={styles.categoryLabel}>
            {"last updated: " +
              timestampToString(resource.last_updated).toLowerCase()}
          </p>
          <QRCode className={styles.QrCode} value={resource.url} />
        </div>
      </div>
    );
  }

  return (
    <div>
      {resources.map((resource) => {
        return <Resource key={resource.url} resource={resource} />;
      })}
    </div>
  );
}
