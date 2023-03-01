import { createConfig } from "../../tsup.config.shared"

export default createConfig({
  name: "fWorker",
  noExternal: ["fCanvas"]
})
