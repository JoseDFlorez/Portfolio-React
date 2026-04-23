import { env } from "./env.server";

type LogLevel = "debug" | "info" | "warn" | "error";

function emit(level: LogLevel, evt: string, data?: Record<string, unknown>) {
  if (env.NODE_ENV === "test") return;
  const line = {
    ts: new Date().toISOString(),
    level,
    pid: typeof process !== "undefined" ? process.pid : 0,
    evt,
    ...data,
  };
  const serialized = JSON.stringify(line);
  if (level === "error" || level === "warn") {
    console.error(serialized);
  } else {
    console.log(serialized);
  }
}

export const log = {
  debug: (evt: string, data?: Record<string, unknown>) => emit("debug", evt, data),
  info: (evt: string, data?: Record<string, unknown>) => emit("info", evt, data),
  warn: (evt: string, data?: Record<string, unknown>) => emit("warn", evt, data),
  error: (evt: string, data?: Record<string, unknown>) => emit("error", evt, data),
};
