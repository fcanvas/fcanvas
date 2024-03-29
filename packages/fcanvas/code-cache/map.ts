import { tmx } from "tmx-tiledmap"
import fs from "fs"

tmx(fs.readFileSync("./level1.tmx", "utf8")).then((map) => {
  fs.writeFileSync("level1.json", JSON.stringify(map, null, 2))
  if (__DEV__)
    console.dir(map, {
      // depth: null
    })
})
