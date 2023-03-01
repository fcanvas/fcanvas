export const sharedConfig = {
  server: {
    hmr: {
      // removes the protocol and replaces it with the port we're connecting to
      host: process.env.GITPOD_WORKSPACE_URL?.replace("https://", "5173-"),
      protocol: "wss",
      clientPort: 443
    }
  },
  define: {
    __DEV__: true,
    __DEV_LIB__: true
  }
}
