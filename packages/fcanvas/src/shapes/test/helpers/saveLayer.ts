import { writeFileSync } from "fs"
import { join } from "path"

function dataURItoBlob(dataURI: string) {
  // convert base64 to raw binary data held in a string
  // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
  const byteString = atob(dataURI.split(",")[1])

  // write the bytes of the string to an ArrayBuffer
  const ab = new ArrayBuffer(byteString.length)

  // create a view into the buffer
  const ia = new Uint8Array(ab)

  // set the bytes of the buffer to the correct values
  // eslint-disable-next-line functional/no-let
  for (let i = 0; i < byteString.length; i++) ia[i] = byteString.charCodeAt(i)

  return ab
}

export function saveLayer(data: string, filename: string) {
  writeFileSync(
    join(__dirname, "..", "assets", filename),
    Buffer.from(dataURItoBlob(data))
  )
}
