"use client";

import { Resource } from "@/app/core/types";
import classes from "./ResourcesList.module.css";
import QRCode from "react-qr-code";
import { timestampToString } from "@/app/core/helper";

export default function ResourcesList(props: {
  resources: Resource[];
  setResources: Function;
}) {
  function Resource(props: { resource: Resource }) {
    return (
      <div className={classes.resource_container}>
        <div className={classes.resource_text_content}>
          <h2>{props.resource.label}</h2>
          <h4 className={classes.shorten_line_height}>
            {props.resource.organization}
          </h4>
          <p
            className={
              classes.category_label + " " + classes.shorten_line_height
            }
          >
            {props.resource.category.toLowerCase()}
          </p>

          <p className={classes.shorten_line_height}>
            {props.resource.description}
          </p>
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
        return <Resource key={resource.url} resource={resource} />;
      })}
    </div>
  );
}
