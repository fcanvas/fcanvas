import type { Group } from "src/Group"

import type { Layer } from "../Layer"
import type { Shape } from "../Shape"
import { Stage } from "../Stage"
import { CONFIGS, isDOM } from "../configs"
import { BOUNDING_CLIENT_RECT, CANVAS_ELEMENT } from "../symbols"
import type { Rect } from "../type/Rect"

export interface OptionsToCanvas extends Partial<Rect> {
  pixelRatio?: number
}

/**
 * @source - re-used from https://github.com/tachibana-shin/fcanvas-next/blob/v0.2.14/packages/fcanvas/src/Container.ts
 */
export function toCanvas(
  fElement: Layer | Shape | Group | Stage,
  config?: OptionsToCanvas
): HTMLCanvasElement {
  const canvasCache: HTMLCanvasElement | undefined = (fElement as Layer)[
    CANVAS_ELEMENT
  ]

  const canvas = CONFIGS.createCanvas()

  if (config?.width !== undefined) {
    canvas.width = config.width
  } else {
    if (canvasCache) {
      canvas.width = canvasCache.width
    } else {
      const { width } = fElement[BOUNDING_CLIENT_RECT].value
      canvas.width = width
    }
  }
  if (config?.height !== undefined) {
    canvas.height = config.height
  } else {
    if (canvasCache) {
      canvas.height = canvasCache.height
    } else {
      const { height } = fElement[BOUNDING_CLIENT_RECT].value
      canvas.height = height
    }
  }

  // eslint-disable-next-line functional/no-let
  let pixelRatioBk: number | void

  if (config?.pixelRatio !== undefined) {
    if (!isDOM) {
      console.warn(
        "[fcanvas/toCanvas]: Can't handle options 'pixelRatio' in a DOM-free environment"
      )
    } else {
      pixelRatioBk = window.devicePixelRatio
      window.devicePixelRatio = config.pixelRatio
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const ctx = canvas.getContext("2d")!
  if (config?.x || config?.y) ctx.translate(config?.x ?? 0, config?.y ?? 0)

  if (fElement instanceof Stage) {
    fElement.children.forEach((child) => {
      child.draw()
      ctx.drawImage(child[CANVAS_ELEMENT], 0, 0)
    })
  } else {
    fElement.draw(ctx)
  }
  if (canvasCache) ctx.drawImage(canvasCache, 0, 0)

  if (pixelRatioBk !== undefined) window.devicePixelRatio = pixelRatioBk

  return canvas
}
