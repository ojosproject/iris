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
    icon: "/images/tools/resources.png",
  },
  {
    link: "./care-instructions",
    name: "Care Instructions",
    icon: "/images/tools/care-instructions.png",
  },
  {
    link: "./pro",
    name: "Survey",
    icon: "/images/tools/pro.png",
  },
  {
    link: "./medications",
    name: "Medications",
    icon: "/images/tools/medications.png",
  },
  {
    link: "./call",
    name: "Video",
    icon: "/images/tools/call.png",
  },
  {
    link: "./settings",
    name: "Settings",
    icon: "/images/tools/settings.png",
  },
  {
    link: "./contacts",
    name: "Contacts",
    icon: "/images/tools/contacts.png",
  },
].sort((a, b) => {
  // Sorts list by HubTool.name
  return a.name.localeCompare(b.name);
});
