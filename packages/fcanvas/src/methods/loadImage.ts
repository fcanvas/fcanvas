import normalize from "path-normalize"

// cache
const imageMap = new Map<string, HTMLImageElement>()
function loadImage(url: string, get?: true): Promise<HTMLImageElement>
function loadImage(url: string, get: false): HTMLImageElement

function loadImage(
  url: string,
  get = false
): Promise<HTMLImageElement> | HTMLImageElement {
  if (get) return getImage(url)

  const key = normalize(url)
  const inCache = imageMap.get(key)

  if (inCache) return Promise.resolve(inCache)

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

    // eslint-disable-next-line functional/immutable-data
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
