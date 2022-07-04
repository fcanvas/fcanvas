import type { OptionFilter } from "../helpers/createFilter"
import type { OptionTransform } from "../helpers/createTransform"

import type { Offset } from "./Offset"

export type FillStyle = CanvasGradient | CanvasPattern | string

interface FillModeColor {
  fill: FillStyle
}
interface FillModePattern {
  /* fill pattern */
  // eslint-disable-next-line no-undef
  fillPatternImage: CanvasImageSource
  fillPattern?: {
    repeat?: "repeat" | "repeat-x" | "repeat-y" | "no-repeat"
  } & OptionTransform
  /* /pattern */
}
interface FillModeLinearGradient {
  /* fill linear gradient */
  fillLinearGradient: {
    start: Offset
    end: Offset
    colorStops: [number, string][]
  }
  /* /linear-gradient */
}
interface FillModeRadialGradient {
  /* fill radial gradient */
  fillRadialGradient: {
    start: Offset
    startRadius: number
    end: Offset
    endRadius: number
    colorStops: [number, string][]
  }
  /* /radial-gradient */
}

export type FillModeMixture = {
  fillPriority: "color" | "linear-gradient" | "radial-gradient" | "pattern"
} & Partial<FillModeColor> &
  Partial<FillModePattern> &
  Partial<FillModeLinearGradient> &
  Partial<FillModeRadialGradient>

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type CommonShapeAttrs<This = any> = Offset & {
  fillAfterStrokeEnabled?: boolean
  fillEnabled?: boolean
  stroke?: FillStyle
  strokeWidth?: number
  strokeEnabled?: boolean
  hitStrokeWidth?: number
  strokeHitEnabled?: boolean
  perfectDrawEnabled?: boolean
  shadowForStrokeEnabled?: boolean
  // strokeScaleEnabled?: boolean
  lineJoin?: "bevel" | "round" | "miter"
  lineCap?: "butt" | "round" | "square"
  sceneFunc?: (this: This, context: CanvasRenderingContext2D) => void
} & Partial<FillModeMixture> /* & FillModeMonopole */ & {
    shadowEnabled?: boolean
    shadow?: Partial<Offset> & {
      color: string
      blur: number
      // opacity?: number
    }
  } & {
    dash?: number[]
    dashEnabled?: boolean
    visible?: boolean
    opacity?: number
  } & OptionTransform & {
    filter?: OptionFilter
  }
