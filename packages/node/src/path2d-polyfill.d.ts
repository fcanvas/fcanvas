import type { CONFIGS } from "fcanvas"

declare global {
  const Path2D: typeof CONFIGS["Path2D"]
}

declare module "path2d-polyfill/path2d" {
  const polyfillPath2D: (obj: typeof global) => void

  export { polyfillPath2D }
}
