import type { Options } from "tsup"
import { defineConfig } from "tsup"

const configNormal: Options = {
  entry: ["src/index.ts"],
  clean: true,
  splitting: true,
  treeshake: true,
  dts: true,
  format: ["cjs", "esm"],
  target: "es2015",
  external: ["fcanvas"]
}

export default defineConfig([configNormal])
