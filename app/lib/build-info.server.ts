import { env } from "./env.server";

const boot = new Date();

export type BuildInfo = {
  sha: string;
  commitDate: string;
  bootTime: string;
  tz: string;
  nodeVersion: string;
};

const shortSha = env.COMMIT_SHA ? env.COMMIT_SHA.slice(0, 7) : "dev";

const tz =
  (() => {
    try {
      return Intl.DateTimeFormat().resolvedOptions().timeZone ?? "UTC";
    } catch {
      return "UTC";
    }
  })();

export function getBuildInfo(): BuildInfo {
  return {
    sha: shortSha,
    commitDate: boot.toISOString().slice(0, 10),
    bootTime: boot.toISOString(),
    tz,
    nodeVersion:
      typeof process !== "undefined" ? process.version ?? "unknown" : "unknown",
  };
}
