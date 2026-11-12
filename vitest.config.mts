import path from "node:path";
import { defineConfig } from "vitest/config";

// Unit and component tests. Tests that need a DOM opt in with
// `// @vitest-environment jsdom` at the top of the file.
export default defineConfig({
  resolve: {
    // Same "@/" alias as tsconfig.json.
    alias: { "@": path.resolve(__dirname) },
  },
  test: {
    include: ["lib/**/*.test.{ts,tsx}", "components/**/*.test.{ts,tsx}", "app/**/*.test.{ts,tsx}"],
    setupFiles: ["./vitest.setup.ts"],
  },
});
