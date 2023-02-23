import { CONFIGS } from "../configs"

const REG = /([^/\\.]+)(?:\.[^\\/]+)?$/

function basename(url: string): string {
  const spl = url.replace(/\\/, "/").split("/")

  return REG.exec(spl[spl.length - 1] || "")?.[1] ?? "fcanvas-loader"
}
function unCamelCase(camel: string): string {
  return camel.replace(
    /(?:-|^)([a-z])/gi,
    (_t, e, i) => (i ? " " : "") + e.toUpperCase()
  )
}

export function loadFont(
  url: string,
  fontFamily = unCamelCase(basename(url)),
  onProgress?: (this: XMLHttpRequest, event: ProgressEvent) => void,
  onAllReady?: boolean
) {
  return new Promise<string>((resolve, reject) => {
    if (CONFIGS.registerFont) {
      try {
        CONFIGS.registerFont(url, {
          family: fontFamily
        })
        resolve(fontFamily)
      } catch (err) {
        reject(err)
      }

      return
    }

    const request = new XMLHttpRequest()

    request.addEventListener("readystatechange", async () => {
      if (request.readyState === 4) {
        try {
          if (
            request.status === 200 ||
            request.status === 201 ||
            request.status === 0
          ) {
            // eslint-disable-next-line camelcase
            const junction_font = new FontFace(fontFamily, request.response)
            // eslint-disable-next-line camelcase
            const loaded_face = await junction_font.load()
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            ;(document.fonts as unknown as any).add(loaded_face)

            if (onAllReady) {
              await document.fonts.ready
              resolve(fontFamily)
            } else {
              resolve(fontFamily)
            }
          } else {
            // eslint-disable-next-line functional/no-throw-statement
            throw new Error("Request failed")
          }
        } catch (err) {
          reject(err)
        }
      }
    })
    request.addEventListener("error", reject, {
      once: true
    })

    if (onProgress) request.addEventListener("progress", onProgress)

    request.responseType = "arraybuffer"

    // Downloading a font from the path
    request.open("get", url)

    request.send()
  })
}
