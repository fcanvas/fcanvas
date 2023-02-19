import {
  CanvasRenderingContext2D,
  createCanvas,
  DOMMatrix,
  Image,
  registerFont
} from "canvas"
import { CONFIGS } from "fcanvas"
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import { polyfillPath2D } from "path2d-polyfill"

polyfillPath2D(global)
Object.assign(global, {
  CanvasRenderingContext2D,
  DOMMatrix,
  Image,
  requestAnimationFrame: setImmediate,
  cancelAnimationFrame: clearImmediate,
  UIEvent: class {}
})

Object.assign(CONFIGS, {
  createCanvas,
  registerFont,
  DOMMatrix,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Path2D: (global as unknown as any).Path2D,
  Image
})

export * from "fcanvas"
