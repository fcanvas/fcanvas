import { cropImage, getFetch, getImage, loadFetch, loadImage } from "fcanvas"
import normalize from "path-normalize"
import { parse } from "plist"

import type { Offset } from "../../fcanvas/src/type/Offset"
import type { Rect } from "../../fcanvas/src/type/Rect"
import type { Size } from "../../fcanvas/src/type/Size"

interface CanvasImageResource
  extends OffscreenCanvas,
    Readonly<{
      sourceSize: Size
      sourceColorRect: Rect
      offset: Offset
    }> {}
interface Plist<TileNames extends string> {
  frames: Readonly<
    Record<
      TileNames,
      {
        frame: string
        offset: string
        rotated: boolean
        sourceColorRect: string
        sourceSize: string
      }
    >
  >
  metadata: {
    format: number
    realTextureFileName: string
    size: string
    smartupdate: string
    textureFileName: string
  }
}

const rCurlyBrackets = /^{[^]*}$/
const rOpenBracket = /%7b/gi
const rCloseBracket = /%7d/gi
function parsePlistValueToArray<T>(value: string): T[] {
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
  #plist: Plist<TileNames>
  #tile: HTMLImageElement
  #cache = new Map<TileNames, CanvasImageResource>()

  constructor(
    plist: Plist<TileNames> | string,
    tile?: HTMLImageElement | string
  ) {
    this.#plist =
      typeof plist === "string"
        ? (parse(getFetch(plist)) as unknown as Plist<TileNames>)
        : plist

    tile ??=
      this.#plist.metadata.realTextureFileName ||
      this.#plist.metadata.textureFileName

    this.#tile = typeof tile === "string" ? getImage(tile) : tile
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

function join(p1: string, p2: string): string {
  if (p2.includes("://")) return p2

  // const

  return normalize(p1 + "/../" + p2)
}
function getTextureFileName(metadata: Plist<string>["metadata"]): string {
  return metadata.realTextureFileName ?? metadata.textureFileName
}

export async function loadTiles<TileNames extends string>(
  plistSrc: string,
  tileSrc?: string
): Promise<Tiles<TileNames>> {
  const promiseLoadPlist = loadFetch(plistSrc).then(parse) as Promise<
    Plist<TileNames>
  >
  const promiseLoadTile = tileSrc
    ? loadImage(tileSrc)
    : loadImage(
      join(plistSrc, getTextureFileName((await promiseLoadPlist).metadata))
    )

  const [plist, tile] = await Promise.all([promiseLoadPlist, promiseLoadTile])

  return new Tiles(plist, tile)
}
