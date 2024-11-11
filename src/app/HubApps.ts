import { HubAppProps } from "./components/HubApp";

export const HubApps: HubAppProps[] = [
    {
        link: "./log_view",
        name: "Medication Logging",
        icon: "/images/icon_pill.png"
    },
    {
        link: "./call",
        name: "Video Call",
        icon: "/images/icon_video.png"
    },
    {
        link: "./resources",
        name: "Resources",
        icon: "/images/icon_resources.png"
    }
].sort((a, b) => {
    // Sorts list by HubAppProps.name
    return a.name.localeCompare(b.name);
});
