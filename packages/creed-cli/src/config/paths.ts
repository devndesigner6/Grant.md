import { homedir } from "node:os";
import { existsSync } from "node:fs";
import { join } from "node:path";

function legacyConfigDirectory(env: NodeJS.ProcessEnv): string {
  if (env.CREED_CONFIG_DIR) return env.CREED_CONFIG_DIR;
  if (process.platform === "win32" && env.APPDATA) return join(env.APPDATA, "Creed");
  return join(env.XDG_CONFIG_HOME ?? join(homedir(), ".config"), "creed");
}

export function configDirectory(env: NodeJS.ProcessEnv = process.env): string {
  if (env.GRANT_CONFIG_DIR) return env.GRANT_CONFIG_DIR;
  const grantDirectory = process.platform === "win32" && env.APPDATA
    ? join(env.APPDATA, "Grant")
    : join(env.XDG_CONFIG_HOME ?? join(homedir(), ".config"), "grant");
  return existsSync(grantDirectory) ? grantDirectory : legacyConfigDirectory(env);
}

export function credentialsPath(env: NodeJS.ProcessEnv = process.env): string {
  return join(configDirectory(env), "credentials.json");
}

export function settingsPath(env: NodeJS.ProcessEnv = process.env): string {
  return join(configDirectory(env), "config.json");
}
