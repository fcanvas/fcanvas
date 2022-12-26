import { Shape } from "fcanvas"
import gsap from "gsap"

import type { PersonalAttrs } from "../../fcanvas/src/shapes/Arc"
import type { CommonShapeAttrs } from "../../fcanvas/src/type/CommonShapeAttrs"

declare module "fcanvas" {
  export class Shape<
    // eslint-disable-next-line @typescript-eslint/ban-types
    PersonalAttrs extends Record<string, unknown> = {}
  > {
    public to(
      attrs: gsap.TweenVars &
        Partial<CommonShapeAttrs<PersonalAttrs>> & {
          keyframes: (gsap.TweenVars &
            Partial<CommonShapeAttrs<PersonalAttrs>>)[]
        }
    ): gsap.core.Tween
  }
}

Shape.prototype.to = function (
  attrs: gsap.TweenVars &
    Partial<CommonShapeAttrs<PersonalAttrs>> & {
      keyframes: (gsap.TweenVars & Partial<CommonShapeAttrs<PersonalAttrs>>)[]
    }
): gsap.core.Tween {
  return gsap.to(this.$, attrs)
}

export { Animation } from "./Animation"
export * from "./symbols"
