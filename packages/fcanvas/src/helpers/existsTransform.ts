import type { OptionTransform } from "./createTransform"

export function existsTransform(
  attrs: OptionTransform,
  checkOffset = false
): boolean {
  return (
    (checkOffset && !!(attrs.x || attrs.y)) ||
    !!(
      (attrs.scale && (attrs.scale.x || attrs.scale.y)) ||
      attrs.rotation ||
      (attrs.offset && (attrs.offset.x || attrs.offset.y)) ||
      attrs.skewX ||
      attrs.skewY
    )
  )
}
