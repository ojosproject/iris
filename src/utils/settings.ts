import { Config } from "@/types/settings";
import { userConfigDir, providerConfigDir } from "./folders";
import {
  exists,
  mkdir,
  readTextFile,
  writeTextFile,
} from "@tauri-apps/plugin-fs";
import { join } from "@tauri-apps/api/path";

export async function getConfig(
  of = "user" as "user" | "provider",
): Promise<Config> {
  const uConfigDir = await userConfigDir();
  const pConfigDir = await providerConfigDir();
  const configDir = of === "user" ? uConfigDir : pConfigDir;
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

export async function completeOnboarding(of = "user" as "user" | "provider") {
  const configDir =
    of === "user" ? await userConfigDir() : await providerConfigDir();
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
