import type { Image } from "canvas"

import type { Layer } from "../../../Layer"
import { CANVAS_ELEMENT } from "../../../symbols"

import { compareCanvas } from "./compareCanvas"
import { loadImageFromSystem } from "./loadImageFromSystem"

function createCanvasDrawImage(image: Image) {
  const canvas = document.createElement("canvas")
  // eslint-disable-next-line functional/immutable-data
  canvas.width = image.width
  // eslint-disable-next-line functional/immutable-data
  canvas.height = image.height

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const ctx = canvas.getContext("2d")!
  ctx.drawImage(image as unknown as HTMLCanvasElement, 0, 0)

  return canvas
}

export async function compareLayerWithImage(layer: Layer, path: string) {
  return compareCanvas(
    createCanvasDrawImage(await loadImageFromSystem(path)),
    layer[CANVAS_ELEMENT]
  )
}
