// eslint-disable-next-line functional/no-mixed-type
interface Configs {
  // eslint-disable-next-line functional/no-method-signature
  createContext2D(offscreen?: false): CanvasRenderingContext2D
  // eslint-disable-next-line functional/no-method-signature
  createContext2D(offscreen: true): OffscreenCanvasRenderingContext2D
  // eslint-disable-next-line functional/no-method-signature
  createContext2D(
    offscreen: boolean
  ): CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D
  // eslint-disable-next-line functional/no-method-signature
  createOffscreenCanvas(width?: number, height?: number): OffscreenCanvas
  // eslint-disable-next-line functional/no-method-signature
  createCanvas(): HTMLCanvasElement
  registerFont?: (
    path: string,
    config: { family: string; weight?: string; style?: string }
  ) => void
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
  createContext2D(offscreen?: boolean) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return (
      offscreen ? CONFIGS.createOffscreenCanvas() : CONFIGS.createCanvas()
    ).getContext("2d")! as OffscreenCanvasRenderingContext2D
  },
  createCanvas() {
    return document.createElement("canvas")
  },
  createOffscreenCanvas(width = 300, height = 150) {
    return new Offscreen(width, height)
  }
} as Configs

export const isDOM = typeof document !== "undefined"
