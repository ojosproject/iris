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
    icon: "/images/icon_survey.png"
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
  }
].sort((a, b) => {
  // Sorts list by HubAppProps.name
  return a.name.localeCompare(b.name);
});
