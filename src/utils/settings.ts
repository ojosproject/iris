import { Config } from "@/types/settings";
import { userConfigDir } from "./folders";
import {
  exists,
  mkdir,
  readTextFile,
  writeTextFile,
} from "@tauri-apps/plugin-fs";
import { join } from "@tauri-apps/api/path";

export async function getConfig(): Promise<Config> {
  const configDir = await userConfigDir();
  const configPath = await join(configDir, "config.json");
  const configExists = await exists(configPath);

  if (!configExists) {
    if (!(await exists(configDir))) {
      await mkdir(configDir, { recursive: true });
    }

    const template: Config = {
      appearance: null,
      onboarding_completed: false,
    };

    await writeTextFile(configPath, JSON.stringify(template));
    return template;
  } else {
    const content = await readTextFile(configPath);
    const config: Config = JSON.parse(content);
    return config;
  }
}

export async function completeOnboarding() {
  const configDir = await userConfigDir();
  const configPath = await join(configDir, "config.json");
  const config = await getConfig();

  await writeTextFile(
    configPath,
    JSON.stringify({
      onboarding_completed: true,
      appearance: config.appearance,
    } as Config),
  );
}

export async function setAppearanceConfig(value: "light" | "dark" | null) {
  const configDir = await userConfigDir();
  const configPath = await join(configDir, "config.json");
  const config = await getConfig();

  await writeTextFile(
    configPath,
    JSON.stringify({
      onboarding_completed: config.onboarding_completed,
      appearance: value,
    } as Config),
  );
}
