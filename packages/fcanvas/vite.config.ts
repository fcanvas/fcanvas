import path from "path"

import { defineConfig } from "vite"

import { sharedConfig } from "../../vite.config.shared"

export default defineConfig({
  ...sharedConfig,
  resolve: {
    alias: {
      src: path.resolve(__dirname, "src")
    }
  }
})
