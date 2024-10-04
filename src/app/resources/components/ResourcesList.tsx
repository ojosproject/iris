"use client";

import { Resource } from "@/types";
import classes from "./ResourcesList.module.css";
import QRCode from "react-qr-code";
import { timestampToString } from "@/helper";
import { useEffect } from "react";
import { invoke } from "@tauri-apps/api/core";

export default function ResourcesList(props: {
  resources: Resource[];
  setResources: Function;
}) {
  useEffect(() => {
    invoke("get_resources").then((r) => {
      props.setResources(r as Resource[]);
    });
  }, []);

  function Resource(props: { resource: Resource }) {
    return (
      <div className={classes.resource_container}>
        <div className={classes.resource_text_content}>
          <h2>{props.resource.label}</h2>
          <h4>{props.resource.organization}</h4>
          <p className={classes.category_label}>
            {props.resource.category.toLowerCase()}
          </p>
          <p>{props.resource.description}</p>
        </div>
        <div className={classes.qr_code_container}>
          <p className={classes.category_label}>
            {"last updated: " +
              timestampToString(props.resource.last_updated).toLowerCase()}
          </p>
          <QRCode className={classes.qr_code} value={props.resource.url} />
        </div>
      </div>
    );
  }

  return (
    <div className={classes.resource_list_container}>
      {props.resources.map((resource) => {
        return <Resource key={resource.last_updated} resource={resource} />;
      })}
    </div>
  );
}
