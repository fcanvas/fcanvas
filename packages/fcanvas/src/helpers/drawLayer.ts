import type { Rect } from "../type/Rect"

import type { OptionFilter } from "./createFilter"
import { createFilter } from "./createFilter"
import type { OptionTransform } from "./createTransform"
import { createTransform } from "./createTransform"
import { existsTransform } from "./existsTransform"

export type DrawLayerAttrs = {
  opacity?: number
  clip?: Rect | ((context: Path2D) => void)
} & OptionTransform & {
    filter?: OptionFilter
  }

export function drawLayer(
  context: CanvasRenderingContext2D,
  attrs: DrawLayerAttrs,
  children: Set<{
    // eslint-disable-next-line functional/no-method-signature
    draw(context: CanvasRenderingContext2D): void
  }>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  argThis: any
) {
  const useClip = attrs.clip !== undefined

  if (useClip) {
    context.save()

    if (typeof attrs.clip === "function") {
      const path = new Path2D()
      attrs.clip.call(argThis, path)
      context.clip(path)
    } else {
      context.rect(
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        attrs.clip!.x,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        attrs.clip!.y,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        attrs.clip!.width,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        attrs.clip!.height
      )
    }
  }
  const useTransform = existsTransform(attrs) || !context
  const needSetAlpha = attrs.opacity !== undefined
  const useFilter = attrs.filter !== undefined
  // eslint-disable-next-line functional/no-let
  let backupTransform, backupAlpha: number, backupFilter: string

  if (needSetAlpha) {
    backupAlpha = context.globalAlpha
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    context.globalAlpha = attrs.opacity!
  }
  if (useTransform) {
    backupTransform = context.getTransform()

    context.setTransform(createTransform(attrs, !context))
  }
  if (useFilter) {
    backupFilter = context.filter

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    context.filter = createFilter(attrs.filter!)
  }

  children.forEach((node) => {
    node.draw(context)
  })

  if (useFilter) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    context.filter = backupFilter!
  }
  if (useTransform) context.setTransform(backupTransform)

  if (needSetAlpha) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    context.globalAlpha = backupAlpha!
  }
  if (useClip) context.restore()
}
