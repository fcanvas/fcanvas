import type { Offset } from "../types/Offset"
import type { Size } from "../types/Size"

export function transformedRect(rect: Offset & Size, matrix: DOMMatrix) {
  const points = [
    { x: rect.x, y: rect.y },
    { x: rect.x + rect.width, y: rect.y },
    { x: rect.x + rect.width, y: rect.y + rect.height },
    { x: rect.x, y: rect.y + rect.height }
  ]
  // eslint-disable-next-line functional/no-let
  let minX: number, minY: number, maxX: number, maxY: number

  points.forEach((point) => {
    const transformed = matrix.transformPoint(point)
    if (minX === undefined) {
      minX = maxX = transformed.x
      minY = maxY = transformed.y
    }
    minX = Math.min(minX, transformed.x)
    minY = Math.min(minY, transformed.y)
    maxX = Math.max(maxX, transformed.x)
    maxY = Math.max(maxY, transformed.y)
  })

  return {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    x: minX,
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    y: minY,
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    width: maxX - minX,
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    height: maxY - minY
  }
}
