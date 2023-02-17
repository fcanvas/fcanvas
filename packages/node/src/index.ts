import {
  CanvasRenderingContext2D as $CanvasRenderingContext2D,
  createCanvas,
  DOMMatrix,
  Image,
  registerFont
} from "canvas"
import { CONFIGS } from "fcanvas"
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import { polyfillPath2D } from "path2d-polyfill/path2d"

polyfillPath2D(global)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
;(global as unknown as any).CanvasRenderingContext2D = $CanvasRenderingContext2D
// eslint-disable-next-line @typescript-eslint/no-explicit-any
;(global as unknown as any).requestAnimationFrame = setImmediate
// eslint-disable-next-line @typescript-eslint/no-explicit-any
;(global as unknown as any).cancelAnimationFrame = clearImmediate

Object.assign(CONFIGS, {
  createCanvas,
  registerFont,
  DOMMatrix,
  Path2D,
  Image
})

export * from "fcanvas"
