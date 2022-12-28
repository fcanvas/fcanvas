import type { UnwrapNestedRefs } from "@vue/reactivity"

import { Shape } from "../Shape"
import type { CommonShapeAttrs } from "../type/CommonShapeAttrs"
import type { ReactiveType } from "../type/fn/ReactiveType"

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
type PersonalAttrs = {
  pointerDirection?: "up" | "down" | "left" | "right" | "none"
  pointerWidth?: number
  pointerHeight?: number
  cornerRadius?: number | number[]
  width?: number
  height?: number
}

export class Tag extends Shape<PersonalAttrs> {
  static readonly type = "Tag"

  protected _sceneFunc(context: CanvasRenderingContext2D) {
    const width = this.$.width ?? 0
    const height = this.$.height ?? 0
    const pointerDirection = this.$.pointerDirection
    const { pointerWidth = 20, pointerHeight = 20, cornerRadius } = this.$

    // eslint-disable-next-line functional/no-let
    let topLeft = 0
    // eslint-disable-next-line functional/no-let
    let topRight = 0
    // eslint-disable-next-line functional/no-let
    let bottomRight = 0
    // eslint-disable-next-line functional/no-let
    let bottomLeft = 0
    const ws2 = (this.$.width ?? 0) / 2
    const hs2 = (this.$.height ?? 0) / 2
    if (typeof cornerRadius === "number") {
      topLeft = Math.min(cornerRadius, ws2, hs2)
      topRight = topLeft
      bottomRight = topLeft
      bottomLeft = topLeft
    } else if ((cornerRadius as number[]).length === 2) {
      topLeft = Math.min((cornerRadius as number[])[0], ws2, hs2)
      bottomRight = topLeft

      topRight = Math.min((cornerRadius as number[])[1], ws2, hs2)
      bottomLeft = topRight
    } else {
      ;[topLeft, topRight, bottomRight, bottomLeft] = [
        Math.min((cornerRadius as number[])[0], ws2, hs2),

        Math.min((cornerRadius as number[])[1], ws2, hs2),

        Math.min((cornerRadius as number[])[2], ws2, hs2),

        Math.min((cornerRadius as number[])[3], ws2, hs2)
      ]
    }

    context.moveTo(topLeft, 0)

    if (pointerDirection === "up") {
      context.lineTo((width - pointerWidth) / 2, 0)
      context.lineTo(width / 2, -1 * pointerHeight)
      context.lineTo((width + pointerWidth) / 2, 0)
    }

    context.lineTo(width - topRight, 0)
    context.arc(
      width - topRight,
      topRight,
      topRight,
      (Math.PI * 3) / 2,
      0,
      false
    )

    if (pointerDirection === "right") {
      context.lineTo(width, (height - pointerHeight) / 2)
      context.lineTo(width + pointerWidth, height / 2)
      context.lineTo(width, (height + pointerHeight) / 2)
    }

    context.lineTo(width, height - bottomRight)
    context.arc(
      width - bottomRight,
      height - bottomRight,
      bottomRight,
      0,
      Math.PI / 2,
      false
    )

    if (pointerDirection === "down") {
      context.lineTo((width + pointerWidth) / 2, height)
      context.lineTo(width / 2, height + pointerHeight)
      context.lineTo((width - pointerWidth) / 2, height)
    }

    context.lineTo(bottomLeft, height)
    context.arc(
      bottomLeft,
      height - bottomLeft,
      bottomLeft,
      Math.PI / 2,
      Math.PI,
      false
    )

    if (pointerDirection === "left") {
      context.lineTo(0, (height + pointerHeight) / 2)
      context.lineTo(-1 * pointerWidth, height / 2)
      context.lineTo(0, (height - pointerHeight) / 2)
    }

    context.lineTo(0, topLeft)
    context.arc(topLeft, topLeft, topLeft, Math.PI, (Math.PI * 3) / 2, false)

    this.fillStrokeScene(context)
  }

  constructor(
    attrs: ReactiveType<
      CommonShapeAttrs<PersonalAttrs> & {
        setup?: (
          this: Tag,
          attrs: UnwrapNestedRefs<CommonShapeAttrs<PersonalAttrs>>
        ) => void
      } & ThisType<Tag>
    >
  ) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    super(attrs as unknown as any)
  }

  public getRect() {
    // eslint-disable-next-line functional/no-let
    let x = 0
    // eslint-disable-next-line functional/no-let
    let y = 0
    // eslint-disable-next-line functional/no-let
    let width = this.$.width ?? 0
    // eslint-disable-next-line functional/no-let
    let height = this.$.height ?? 0
    const {
      pointerWidth = 20,
      pointerHeight = 20,
      pointerDirection: direction
    } = this.$

    switch (direction) {
      case "up":
        y -= pointerHeight
        height += pointerHeight
        break
      case "down":
        height += pointerHeight
        break
      case "left":
        // ARGH!!! I have no idea why should I used magic 1.5!!!!!!!!!
        x -= pointerWidth * 1.5
        width += pointerWidth
        break
      case "right":
        width += pointerWidth * 1.5
        break
    }
    return {
      x,
      y,
      width,
      height
    }
  }
}
