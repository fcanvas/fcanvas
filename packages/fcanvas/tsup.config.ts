import type { Options } from "tsup"
import { defineConfig } from "tsup"

const configNormal: Options = {
  entry: ["src/index.ts"],
  clean: true,
  splitting: true,
  dts: true,
  format: ["cjs", "esm", "iife"],
  target: "es2015"
}
const configBrowser: Options = {
  entry: {
    "index.browser": "src/index.ts"
  },
  dts: false,
  splitting: true,
  format: ["esm"],
  target: "es2015",
  noExternal: ["@vue/reactivity", "@vue/shared", "@vue-reactivity/watch", "gsap", "path-normalize"]
}
const configBrowserMinify: Options = {
  ...configBrowser,
  entry: {
    "index.browser.min": "src/index.ts"
  },
  minify: true
}

export default defineConfig([configNormal, configBrowser, configBrowserMinify])
