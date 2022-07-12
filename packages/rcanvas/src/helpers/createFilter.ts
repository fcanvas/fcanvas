import type { Offset } from "../type/Offset"

import { convertToDegrees } from "./convertToDegrees"

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
  if (options.url !== undefined)
    filter += ` url(${JSON.stringify(options.url)})`

  if (options.blur !== undefined) filter += ` blur(${options.blur}px)`

  if (options.brightness !== undefined)
    filter += ` brightness(${options.brightness}%)`

  if (options.contrast !== undefined) filter += ` contrast(${options.contrast})`

  if (options.dropShadow !== undefined) {
    filter += ` drop-shadow(${options.dropShadow.x ?? 0}px ${

      options.dropShadow.y ?? 0

    }px ${options.dropShadow.blur ?? 0}px ${options.dropShadow.color})`
  }
  if (options.greyscale !== undefined)
    filter += ` greyscale(${options.greyscale}%)`

  if (options.hueRotate !== undefined)
    filter += ` hue-rotate(${convertToDegrees(options.hueRotate)}deg)`

  if (options.invert !== undefined) filter += ` invert(${options.invert}%)`

  if (options.opacity !== undefined) filter += ` opacity(${options.opacity}%)`

  if (options.saturate !== undefined)
    filter += ` saturate(${options.saturate}%)`

  if (options.sepia !== undefined) filter += ` sepia(${options.sepia}%)`

  if (filter === "") filter = "none"

  return filter.trim()
}
