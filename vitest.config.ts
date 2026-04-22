import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    environment: "jsdom",
    globals: true,
    include: ["app/**/*.{test,spec}.{ts,tsx}"],
    exclude: [
      "node_modules",
      "build",
      ".react-router",
      "e2e/**",
    ],
  },
  resolve: {
    alias: {
      "~": new URL("./app/", import.meta.url).pathname,
    },
  },
});
