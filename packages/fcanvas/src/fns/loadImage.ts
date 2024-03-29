import normalize from "path-normalize"

import { CONFIGS } from "../configs"

// cache
const imageMap = new Map<string, HTMLImageElement>()
function loadImage(url: string, get?: false): Promise<HTMLImageElement>
// eslint-disable-next-line no-redeclare
function loadImage(url: string, get: true): HTMLImageElement

// eslint-disable-next-line no-redeclare
function loadImage(
  url: string,
  get = false
): Promise<HTMLImageElement> | HTMLImageElement {
  if (get) return getImage(url)

  const key = normalize(url)
  const inCache = imageMap.get(key)

  if (inCache) return Promise.resolve(inCache)

  if (CONFIGS.loadImage) {
    return CONFIGS.loadImage(url).then((img: HTMLImageElement) => {
      imageMap.set(key, img)
      return img
    })
  }
  const img = new Image()

  return new Promise((resolve, reject) => {
    function done() {
      imageMap.set(key, img)
      resolve(img)
      img.removeEventListener("load", done)
      img.removeEventListener("error", fail)
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    function fail(err: any) {
      reject(err)
      img.removeEventListener("load", done)
      img.removeEventListener("error", fail)
    }

    img.addEventListener("load", done)
    img.addEventListener("error", fail)

    img.src = url
  })
}

export { loadImage }
export function getImage(url: string): HTMLImageElement {
  if (!imageMap.has(normalize(url)))
    // eslint-disable-next-line functional/no-throw-statement
    throw new Error(`Cannot find image ${url}. First run await loadImage().`)

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  return imageMap.get(normalize(url))!
}
