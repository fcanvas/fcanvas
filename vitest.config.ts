// eslint-disable-next-line n/no-unpublished-import
import { defineConfig } from "vitest/config"

export default defineConfig({
  test: {
    environment: "jsdom", // or 'jsdom', 'node'
    threads: false,
    globals: true
  }
})
