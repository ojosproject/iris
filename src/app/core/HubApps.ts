import { HubAppProps } from "./hub/HubApp";

export const HubApps: HubAppProps[] = [
  {
    link: "./resources",
    name: "Resources",
    icon: "/images/icon_resources.png",
  },

  // Extra care instructions provided by the caregivers for the nurses.
  {
    link: "./care_instructions",
    name: "Care Instructions",
    icon: "/images/icon_care_instructions.png",
  },
  {
    link: "./pro",
    name: "Survey",
  },
  {
    link: "./medications",
    name: "Medications",
    icon: "/images/icon_pill.png",
  },
].sort((a, b) => {
  // Sorts list by HubAppProps.name
  return a.name.localeCompare(b.name);
});
