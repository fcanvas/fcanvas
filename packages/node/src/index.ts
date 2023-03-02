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

Object.assign(global, {
  CanvasRenderingContext2D,
  DOMMatrix,
  Image,
  requestAnimationFrame: setImmediate,
  cancelAnimationFrame: clearImmediate
})
polyfillPath2D(global)

const conf: typeof CONFIGS = {
  createCanvas() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return createCanvas(300, 150) as unknown as any
  },
  createOffscreenCanvas(width = 300, height = 150) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return createCanvas(width, height) as unknown as any
  },
  registerFont
}
Object.assign(CONFIGS, conf)

export * from "fcanvas"
