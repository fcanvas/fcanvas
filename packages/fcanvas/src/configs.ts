interface Configs {
  createCanvas: () => HTMLCanvasElement
  createContext2D: () => CanvasRenderingContext2D
  registerFont?: (
    path: string,
    config: { family: string; weight?: string; style?: string }
  ) => void
}

export const CONFIGS: Configs = {
  createCanvas() {
    return document.createElement("canvas")
  },
  createContext2D() {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return CONFIGS.createCanvas().getContext("2d")!
  }
}
