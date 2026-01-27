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
    icon: "/images/tools/resources_light.png",
  },
  {
    link: "./care-instructions",
    name: "Care Instructions",
    icon: "/images/tools/care_instructions_light.png",
  },
  {
    link: "./pro",
    name: "Survey",
    icon: "/images/tools/pro_light.png",
  },
  {
    link: "./medications",
    name: "Medications",
    icon: "/images/tools/medications_light.png",
  },
  {
    link: "./call",
    name: "Video",
    icon: "/images/tools/call_light.png",
  },
  {
    link: "./settings/device",
    name: "Settings",
    icon: "/images/tools/settings_light.png",
  },
  {
    link: "./contacts",
    name: "Contacts",
    icon: "/images/tools/contacts_light.png",
  },
].sort((a, b) => {
  // Sorts list by HubTool.name
  return a.name.localeCompare(b.name);
});
