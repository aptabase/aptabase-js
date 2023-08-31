import { exec } from "child_process";
import type { App } from "electron";
import { readFile } from "fs";
import { release } from "os";

// env.PKG_VERSION is replaced by Vite during build phase
const sdkVersion = "aptabase-electron@env.PKG_VERSION";

export interface EnvironmentInfo {
  isDebug: boolean;
  locale: string;
  appVersion: string;
  sdkVersion: string;
  osName: String;
  osVersion: String;
  engineName: String;
  engineVersion: String;
}

export async function getEnvironmentInfo(app: App): Promise<EnvironmentInfo> {
  const [osName, osVersion] = await getOperatingSystem();

  return {
    appVersion: app.getVersion(),
    isDebug: !app.isPackaged,
    locale: app.getLocale(),
    osName,
    osVersion,
    engineName: "Chromium",
    engineVersion: process.versions.chrome,
    sdkVersion,
  };
}

async function getOperatingSystem(): Promise<[string, string]> {
  switch (process.platform) {
    case "win32":
      return ["Windows", release()];
    case "darwin":
      const macOSVersion = await getMacOSVersion();
      return ["macOS", macOSVersion];
    default:
      return await getLinuxInfo();
  }
}

async function getMacOSVersion() {
  try {
    const output = await new Promise<string>((resolve, reject) => {
      exec(
        "/usr/bin/sw_vers -productVersion",
        (error: Error | null, stdout: string) => {
          if (error) {
            reject(error);
            return;
          }
          resolve(stdout);
        }
      );
    });
    return output.trim();
  } catch (ex) {
    return "";
  }
}

async function getLinuxInfo(): Promise<[string, string]> {
  try {
    const content = await new Promise<string>((resolve, reject) => {
      readFile(
        "/etc/os-release",
        "utf8",
        (error: Error | null, output: string) => {
          if (error) {
            reject(error);
            return;
          }
          resolve(output);
        }
      );
    });

    const lines = content.split("\n");
    const osData: Record<string, string> = {};
    for (const line of lines) {
      const [key, value] = line.split("=");
      if (key && value) {
        osData[key] = value.replace(/"/g, ""); // Remove quotes if present
      }
    }
    const osName = osData["NAME"] ?? "Linux";
    const osVersion = osData["VERSION_ID"] ?? "";
    return [osName, osVersion];
  } catch {
    return ["Linux", ""];
  }
}
