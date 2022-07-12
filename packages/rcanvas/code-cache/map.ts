import { tmx } from "tmx-tiledmap"
import fs from "fs"

tmx(fs.readFileSync("./level1.tmx", "utf8")).then((map) => {
  fs.writeFileSync("level1.json", JSON.stringify(map, null, 2))
  console.dir(map, {
    // depth: null
  })
})
