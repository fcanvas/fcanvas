import { createConfig } from "../../tsup.config.shared"

export default createConfig({
  name: "fAnimate",
  noExternal: ["fcanvas", "gsap"]
})
