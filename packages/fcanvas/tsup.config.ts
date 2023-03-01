import { createConfig } from "../../tsup.config.shared"

export default createConfig({
  name: "fCanvas",
  noExternal: ["@vue/reactivity", "@vue/shared", "path-normalize"]
})
