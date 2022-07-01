import type { VirtualChildNode } from "../Container"
import { Utils } from "../Utils"
import type { Offset } from "../types/Offset"

import type { OptionFilter } from "./createFilter"
import { createFilter } from "./createFilter"
import type { OptionTransform } from "./createTransform"
import { createTransform } from "./createTransform"

export type AttrsDrawLayerContext = {
  opacity?: number

  clip?:
    | (Offset & {
        width: number

        height: number
      })
    | ((context: Path2D) => void)
} & OptionTransform & {
    filter?: OptionFilter
  }

export function drawLayerContextUseOpacityClipTransformFilter<
  T extends VirtualChildNode & {
    // eslint-disable-next-line functional/no-method-signature
    draw(context: CanvasRenderingContext2D): void
  }
>(
  context: CanvasRenderingContext2D,
  attrs: AttrsDrawLayerContext,

  children: Set<T>,
  filterItem?: (node: T, index: number) => void | boolean,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  argThis: any = undefined
) {
  const needBackup = attrs.clip !== undefined

  if (needBackup) {
    context.save()

    if (typeof attrs.clip === "function") {
      const path = new Utils.Path2D()
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
  const needUseTransform =
    attrs.scale !== undefined ||
    attrs.rotation !== undefined ||
    attrs.offset !== undefined ||
    attrs.skewX !== undefined ||
    attrs.skewY !== undefined ||
    !context
  const needSetAlpha = attrs.opacity !== undefined
  const useFilter = attrs.filter !== undefined
  // eslint-disable-next-line functional/no-let
  let backupTransform, backupAlpha: number, backupFilter: string

  if (needSetAlpha) {
    backupAlpha = context.globalAlpha
    // eslint-disable-next-line functional/immutable-data, @typescript-eslint/no-non-null-assertion
    context.globalAlpha = attrs.opacity!
  }
  if (needUseTransform) {
    backupTransform = context.getTransform()

    context.setTransform(createTransform(attrs, !context))
  }
  if (useFilter) {
    backupFilter = context.filter

    // eslint-disable-next-line functional/immutable-data, @typescript-eslint/no-non-null-assertion
    context.filter = createFilter(attrs.filter!)
  }

  children.forEach((node, index) => {
    if (!filterItem || filterItem?.(node, index as unknown as number))
      node.draw(context)
  })

  if (useFilter) {
    // eslint-disable-next-line functional/immutable-data, @typescript-eslint/no-non-null-assertion
    context.filter = backupFilter!
  }
  if (needUseTransform) context.setTransform(backupTransform)

  if (needSetAlpha) {
    // eslint-disable-next-line functional/immutable-data, @typescript-eslint/no-non-null-assertion
    context.globalAlpha = backupAlpha!
  }
  if (needBackup) context.restore()
}
