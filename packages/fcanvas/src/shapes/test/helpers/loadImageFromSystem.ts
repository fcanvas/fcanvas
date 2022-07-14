import { readFileSync } from "fs"
import { join } from "path"

import { loadImage } from "canvas"

export async function loadImageFromSystem(path: string) {
  return await loadImage(
    "data:image/png;base64," +
      readFileSync(join(__dirname, "..", "assets", path), "base64")
  )
}
