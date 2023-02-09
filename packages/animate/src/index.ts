import type { Shape } from "fcanvas"
import gsap from "gsap"

export function installAnimate(shape: typeof Shape) {
  shape.prototype.to = function (attrs) {
    return gsap.to(this.$, attrs)
  }
}

export { Animation } from "./Animation"
export * from "./symbols"
export * from "./getDuration"
