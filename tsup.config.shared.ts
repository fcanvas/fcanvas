import { replace } from "esbuild-plugin-replace"
import type { Options } from "tsup"
import { defineConfig } from "tsup"

export function createConfig({
  name,
  noExternal
}: {
  name: string
  noExternal: string[]
}) {
  const cjsAndEsmNPM: Options = {
    name,
    entry: ["src/index.ts"],
    clean: true,
    splitting: true,
    treeshake: true,
    dts: true,
    format: ["cjs", "esm"],
    target: "es2015",
    define: {
      __DEV_LIB__: JSON.stringify(false)
    },
    esbuildPlugins: [
      replace({
        __DEV__: "process.env.NODE_ENV !== 'production'"
      })
    ]
  }
  const esmAndIIFEBrowser: Options = {
    name,
    entry: {
      "index.browser": "src/index.ts"
    },
    dts: false,
    splitting: true,
    treeshake: true,
    format: ["esm", "iife"],
    target: "es2015",
    noExternal,
    define: {
      __DEV_LIB__: JSON.stringify(false)
    },
    esbuildPlugins: [
      replace({
        __DEV__: "window.__DEV__ !== false",
        "process.env.NODE_ENV":
          "(window.__DEV__ !== false ? \"development\" : \"production\")"
      })
    ],
    globalName: name
  }
  const esmAndIIFEBrowserMin: Options = {
    ...esmAndIIFEBrowser,
    entry: {
      "index.browser.min": "src/index.ts"
    },
    minify: true,
    define: {
      __DEV__: JSON.stringify(false),
      __DEV_LIB__: JSON.stringify(false),
      "process.env.NODE_ENV": JSON.stringify(false)
    },
    esbuildPlugins: []
  }

  return defineConfig([cjsAndEsmNPM, esmAndIIFEBrowser, esmAndIIFEBrowserMin])
}
