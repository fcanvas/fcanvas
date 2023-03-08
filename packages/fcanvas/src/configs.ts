interface Configs {
  // eslint-disable-next-line functional/no-method-signature
  createOffscreenCanvas(width?: number, height?: number): OffscreenCanvas
  // eslint-disable-next-line functional/no-method-signature
  createCanvas(): HTMLCanvasElement
  registerFont?: (
    path: string,
    config: { family: string; weight?: string; style?: string }
  ) => void
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  loadImage?: (url: string) => any
}

const Offscreen =
  typeof OffscreenCanvas !== "undefined"
    ? OffscreenCanvas
    : class Offscreen {
      constructor(width: number, height: number) {
        const canvas = document.createElement("canvas")
          ;[canvas.width, canvas.height] = [width, height]
        return canvas
      }
    }

export const CONFIGS = {
  createCanvas() {
    return document.createElement("canvas")
  },
  createOffscreenCanvas(width = 300, height = 150) {
    return new Offscreen(width, height)
  }
} as Configs

export const isDOM = typeof document !== "undefined"

export function createContext2D(offscreen?: boolean) {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  return (
    offscreen ? CONFIGS.createOffscreenCanvas() : CONFIGS.createCanvas()
  ).getContext("2d")! as OffscreenCanvasRenderingContext2D
}
