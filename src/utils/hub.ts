/**
 * File:     utils/hub.ts
 * Purpose:  Utilities for the Iris hub.
 * Authors:  Ojos Project & Iris contributors
 * License:  GNU General Public License v3.0
 */
import { HubTool } from "@/types/hub";

export const hubTools: HubTool[] = [
  {
    link: "./resources",
    name: "Resources",
    icon: "/images/icon_resources.png",
  },
  {
    link: "./care_instructions",
    name: "Care Instructions",
    icon: "/images/icon_care_instructions.png",
  },
  {
    link: "./pro",
    name: "Survey",
    icon: "/images/icon_survey.png",
  },
  {
    link: "./medications",
    name: "Medications",
    icon: "/images/icon_pill.png",
  },
  {
    link: "./call",
    name: "Video",
    icon: "/images/icon_video.png",
  },
  {
    link: "./settings",
    name: "Settings",
    icon: "/images/icon_settings.png",
  },
  {
    link: "./contacts",
    name: "Contacts",
    icon: "/images/icon_contacts.png",
  },
].sort((a, b) => {
  // Sorts list by HubTool.name
  return a.name.localeCompare(b.name);
});
