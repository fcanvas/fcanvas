import type { OptionTransform } from "./createTransform"

export function existsTransform(
  attrs: OptionTransform,
  checkOffset = false
): boolean {
  if (checkOffset && (attrs.x !== undefined || attrs.y !== undefined))
    return true

  if (attrs.scale?.x !== undefined || attrs.scale?.y !== undefined) return true

  if (attrs.rotation !== undefined) return true

  if (attrs.offset?.x !== undefined || attrs.offset?.y !== undefined)
    return true

  if (attrs.skewX !== undefined || attrs.skewY !== undefined) return true

  return false
}
