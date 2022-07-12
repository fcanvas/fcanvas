import { defineConfig } from "vite"

export default defineConfig({
  server: {
    hmr: {
      // removes the protocol and replaces it with the port we're connecting to
      host: process.env.GITPOD_WORKSPACE_URL?.replace("https://", "3000-"),
      protocol: "wss",
      clientPort: 443
    }
  }
})
