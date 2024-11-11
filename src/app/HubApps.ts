import { HubAppProps } from "./components/HubApp";

export const HubApps: HubAppProps[] = [
  {
    link: "./resources",
    name: "Resources",
    icon: "/images/icon_resources.png",
  },
].sort((a, b) => {
  // Sorts list by HubAppProps.name
  return a.name.localeCompare(b.name);
});
