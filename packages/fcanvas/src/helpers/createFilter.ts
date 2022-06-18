import type { Offset } from "../types/Offset"

import { convertToDegress } from "./convertToDegress"

export type OptionFilter =
  | "none"
  | {
      url?: string // string

      blur?: number // px

      brightness?: number // int%

      contrast?: number // 0 -> 100%

      dropShadow?: Partial<Offset> & {
        blur?: number // intpx > 0

        color: string
      }

      greyscale?: number // int%

      hueRotate?: number // 0 -> 360 deg

      invert?: number // int%

      opacity?: number // 0 -> 100%

      saturate?: number // int%

      sepia?: number // int%
    }
export function createFilter(options: OptionFilter): string {
  if (options === "none") return "none"

  // eslint-disable-next-line functional/no-let
  let filter = ""
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  if (options!.url !== undefined) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    filter += ` url(${JSON.stringify(options!.url)})`
  }
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  if (options!.blur !== undefined) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    filter += ` blur(${options!.blur}px)`
  }
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  if (options!.brightness !== undefined) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    filter += ` brightness(${options!.brightness}%)`
  }
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  if (options!.contrast !== undefined) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    filter += ` contrast(${options!.contrast})`
  }
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  if (options!.dropShadow !== undefined) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    filter += ` drop-shadow(${options!.dropShadow.x ?? 0}px ${
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      options!.dropShadow.y ?? 0
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    }px ${options!.dropShadow.blur ?? 0}px ${options!.dropShadow.color})`
  }
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  if (options!.greyscale !== undefined) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    filter += ` greyscale(${options!.greyscale}%)`
  }
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  if (options!.hueRotate !== undefined) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    filter += ` hue-rotate(${convertToDegress(options!.hueRotate)}deg)`
  }
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  if (options!.invert !== undefined) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    filter += ` invert(${options!.invert}%)`
  }
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  if (options!.opacity !== undefined) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    filter += ` opacity(${options!.opacity}%)`
  }
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  if (options!.saturate !== undefined) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    filter += ` saturate(${options!.saturate}%)`
  }
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  if (options!.sepia !== undefined) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    filter += ` sepia(${options!.sepia}%)`
  }
  if (filter === "") filter = "none"

  return filter.trim()
}
