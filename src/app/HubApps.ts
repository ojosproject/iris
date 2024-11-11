import { HubAppProps } from "./components/HubApp";

export const HubApps: HubAppProps[] = [
  {
    link: "./resources",
    name: "Resources",
    icon: "/images/icon_resources.png",
  },
  {
    link: "./medication",
    name: "Medications",
    icon: "/images/icon_pill.png",
  },
].sort((a, b) => {
  // Sorts list by HubAppProps.name
  return a.name.localeCompare(b.name);
});
