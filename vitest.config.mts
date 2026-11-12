import { defineConfig } from "vitest/config";

// Unit tests for lib/ and components/. Tests that need a DOM opt in with
// `// @vitest-environment jsdom` at the top of the file.
export default defineConfig({
  test: {
    include: ["lib/**/*.test.{ts,tsx}", "components/**/*.test.{ts,tsx}"],
  },
});
