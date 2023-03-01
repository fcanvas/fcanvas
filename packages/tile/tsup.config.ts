import { createConfig } from "../../tsup.config.shared"

export default createConfig({
  name: "fTile",
  noExternal: ["fcanvas"]
})
