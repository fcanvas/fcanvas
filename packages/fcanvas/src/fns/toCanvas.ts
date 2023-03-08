import type { Group } from "src/Group"

import type { Layer } from "../Layer"
import type { Shape } from "../Shape"
import { Stage } from "../Stage"
import { createContext2D, isDOM } from "../configs"
import { BOUNDING_CLIENT_RECT, CANVAS_ELEMENT } from "../symbols"
import type { Rect } from "../type/Rect"

export interface OptionsToCanvas extends Partial<Rect> {
  pixelRatio?: number
}

/**
 * @source - re-used from https://github.com/fcanvas/fcanvas/blob/v0.2.14/packages/fcanvas/src/Container.ts
 */
export function toCanvas(
  fElement: Layer | Shape | Group | Stage,
  config: OptionsToCanvas & {
    offscreen: true
  }
): OffscreenCanvas
// eslint-disable-next-line no-redeclare
export function toCanvas(
  fElement: Layer | Shape | Group | Stage,
  config?: OptionsToCanvas & {
    offscreen?: false
  }
): HTMLCanvasElement
// eslint-disable-next-line no-redeclare
export function toCanvas(
  fElement: Layer | Shape | Group | Stage,
  config?: OptionsToCanvas & {
    offscreen?: boolean
  }
): HTMLCanvasElement | OffscreenCanvas

// eslint-disable-next-line no-redeclare
export function toCanvas(
  fElement: Layer | Shape | Group | Stage,
  config?: OptionsToCanvas & {
    offscreen?: boolean
  }
) {
  const canvasCache: HTMLCanvasElement | OffscreenCanvas | undefined = (
    fElement as Layer
  )[CANVAS_ELEMENT]

  const ctx = createContext2D(config?.offscreen as boolean)
  const { canvas } = ctx

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
      if (__DEV__) {
        console.warn(
          "[fcanvas/toCanvas]: Can't handle options 'pixelRatio' in a DOM-free environment"
        )
      }
    } else {
      pixelRatioBk = window.devicePixelRatio
      window.devicePixelRatio = config.pixelRatio
    }
  }

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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return canvas as unknown as any
}
