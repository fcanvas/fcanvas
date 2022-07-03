import { parse } from "plist/lib/parse"

import { cropImage } from "./methods/cropImage"
import { Image } from "./shapes/Image"
import type { Offset } from "./types/Offset"
import type { Size } from "./types/Size"

type CanvasImageResource = HTMLCanvasElement & {
  readonly sourceSize: Readonly<Size>
  readonly sourceColorRect: Readonly<Size> & Readonly<Offset>
  readonly offset: Readonly<Offset>
}
interface Plist<TileNames extends string> {
  readonly frames: Readonly<
    Record<
      TileNames,
      {
        readonly frame: string
        readonly offset: string
        readonly rotated: boolean
        readonly sourceColorRect: string
        readonly sourceSize: string
      }
    >
  >
  readonly metadata: {
    readonly format: number
    readonly realTextureFileName: string
    readonly size: string
    readonly smartupdate: string
    readonly textureFileName: string
  }
}

const rCurlyBrackets = /^{[^]*}$/
const rOpenBracket = /%7b/gi
const rCloseBracket = /%7d/gi
function parsePlistValueToArray<T>(value: string): readonly T[] {
  if (rCurlyBrackets.test(value.trim())) {
    value = decodeURIComponent(
      encodeURIComponent(value)
        .replace(rOpenBracket, "[")
        .replace(rCloseBracket, "]")
    )

    // eslint-disable-next-line no-new-func
    return new Function(`return ${value}`)()
  }

  // eslint-disable-next-line functional/no-throw-statement
  throw new Error(`resource "${value}" a malformed field`)
}

export class Tiles<TileNames extends string> {
  readonly #plist: Plist<TileNames>
  readonly #tile: HTMLImageElement
  readonly #cache = new Map<TileNames, CanvasImageResource>()

  constructor(plist: Plist<TileNames>, tile: HTMLImageElement) {
    this.#plist = plist
    this.#tile = tile
  }

  public get(name: TileNames): CanvasImageResource {
    if (this.has(name)) {
      if (this.#cache.has(name) === false) {
        const { frame, rotated, sourceSize, sourceColorRect, offset } =
          this.#plist.frames[name]

        const [[xCutStart, yCutStart], [xCutStop, yCutStop]] =
          parsePlistValueToArray<[number, number]>(frame)

        const imageNotResource = cropImage(
          this.#tile,
          xCutStart,
          yCutStart,
          xCutStop,
          yCutStop,
          rotated ? -90 : 0
        )

        const [width, height] = parsePlistValueToArray<number>(sourceSize)
        const [[xColorRect, yColorRect], [widthColorRect, heightColorRect]] =
          parsePlistValueToArray<[number, number]>(sourceColorRect)
        const [x, y] = parsePlistValueToArray<number>(offset)
        this.#cache.set(
          name,

          Object.assign(imageNotResource, {
            sourceSize: {
              width,
              height
            },
            sourceColorRect: {
              x: xColorRect,
              y: yColorRect,
              width: widthColorRect,
              height: heightColorRect
            },
            offset: {
              x,
              y
            }
          })
        )
      }

      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      return this.#cache.get(name)!
    } else {
      // eslint-disable-next-line functional/no-throw-statement
      throw new Error(`does not exist this file "${name}" in declaration plist`)
    }
  }

  public has(name: TileNames): boolean {
    return name in this.#plist.frames
  }
}

export async function loadTiles<TileNames extends string>(
  plistSrc: string,
  tileSrc?: string
): Promise<Tiles<TileNames>> {
  // eslint-disable-next-line functional/no-let
  let plist: Plist<TileNames>, tile: HTMLImageElement
  if (tileSrc) {
    ;[plist, tile] = await Promise.all([
      fetch(plistSrc)
        .then((res) => res.text())
        .then(parse) as Promise<Plist<TileNames>>,
      Image.fromURL(tileSrc)
    ])
  } else {
    plist = (await fetch(plistSrc)
      .then((res) => res.text())
      .then(parse)) as Plist<TileNames>
    tile = await Image.fromURL(
      plistSrc
        .split("/")
        .filter((item) => /[^\s]/.test(item))
        .slice(0, -1)
        .join("/") +
        "/" +
        plist.metadata.realTextureFileName || plist.metadata.textureFileName
    )
  }

  return new Tiles(plist, tile)
}
