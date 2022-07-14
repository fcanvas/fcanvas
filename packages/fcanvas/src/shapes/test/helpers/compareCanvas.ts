import type { Layer } from "../../../Layer"
import { CANVAS_ELEMENT } from "../../../symbols"

export function compareCanvas(layer: Layer, cv2: HTMLCanvasElement): boolean {
  const cv1 = layer[CANVAS_ELEMENT]
  const ctx1 = cv1.getContext("2d")
  const ctx2 = cv2.getContext("2d")
  if (!ctx1 || !ctx2) return false

  const imageData1 = ctx1.getImageData(0, 0, cv1.width, cv1.height)
  const imageData2 = ctx2.getImageData(0, 0, cv2.width, cv2.height)
  const data1 = imageData1.data
  const data2 = imageData2.data
  const dataLength = data1.length
  // eslint-disable-next-line functional/no-let
  let i = 0
  while (i < dataLength) {
    if (data1[i] !== data2[i]) return false

    i += 4
  }

  return true
}
