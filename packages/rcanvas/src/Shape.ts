/* eslint-disable functional/immutable-data */
import type { ComputedRef } from "@vue/reactivity"
import { computed, EffectScope, reactive } from "@vue/reactivity"
import mitt from "mitt"
import { watchEffect } from "vue"

import type { Container } from "./Container"
import type { OptionFilter } from "./helpers/createFilter"
import { createFilter } from "./helpers/createFilter"
import type { OptionTransform } from "./helpers/createTransform"
import { createTransform } from "./helpers/createTransform"
import { existsTransform } from "./helpers/existsTransform"
import { pointInBox } from "./helpers/pointInBox"
import { transformedRect } from "./helpers/transformerRect"
import {
  BOUNCE_CLIENT_RECT,
  COMPUTED_CACHE,
  CONTEXT_CACHE,
  CONTEXT_CACHE_SIZE,
  DRAW_CONTEXT_ON_SANDBOX,
  EMITTER
} from "./symbols"
import type { GetClientRectOptions } from "./type/GetClientRectOptions"
import type { Offset } from "./type/Offset"
import type { Rect } from "./type/Rect"
import { createEvent } from "./utils/createEvent"

type FillStyle = CanvasGradient | CanvasPattern | string

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

type FillModeMixture = {
  fillPriority: "color" | "linear-gradient" | "radial-gradient" | "pattern"
} & Partial<FillModeColor> &
  Partial<FillModePattern> &
  Partial<FillModeLinearGradient> &
  Partial<FillModeRadialGradient>

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type CommonAttrs<This = any> = Offset & {
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

function getFillPriority(
  attrs: Partial<
    Pick<
      CommonAttrs,
      | "fillPriority"
      | "fillPatternImage"
      | "fillLinearGradient"
      | "fillRadialGradient"
    >
  >
): FillModeMixture["fillPriority"] {
  if (attrs.fillPriority)
    return attrs.fillPriority as FillModeMixture["fillPriority"]

  if (attrs.fillPatternImage !== undefined) return "pattern"

  if (attrs.fillLinearGradient !== undefined) return "linear-gradient"

  if (attrs.fillRadialGradient !== undefined) return "radial-gradient"

  return "color"
}

function setLineStyle(
  context: CanvasRenderingContext2D,
  attrs: Partial<
    Pick<
      CommonAttrs,
      | "strokeEnabled"
      | "strokeWidth"
      | "lineCap"
      | "lineJoin"
      | "dashEnabled"
      | "dash"
    >
  >
) {
  if (attrs.strokeEnabled === false) return

  if (attrs.strokeWidth !== undefined) context.lineWidth = attrs.strokeWidth

  context.lineJoin = attrs.lineJoin ?? "miter"
  context.lineCap = attrs.lineCap ?? "butt"

  if (attrs.dashEnabled ?? true) {
    if (attrs.dash) context.setLineDash(attrs.dash)
  } else if (context.getLineDash().length) {
    context.setLineDash([])
  }
}
function drawShadow(
  context: CanvasRenderingContext2D,
  attrs: Partial<Pick<CommonAttrs, "shadowEnabled" | "shadow">>
) {
  if (attrs.shadowEnabled !== false && attrs.shadow !== undefined) {
    context.shadowColor = attrs.shadow.color
    context.shadowOffsetX = attrs.shadow?.x ?? 0
    context.shadowOffsetY = attrs.shadow?.y ?? 0
    context.shadowBlur = attrs.shadow.blur ?? 0
  } else {
    if (context.shadowColor !== "transparent")
      context.shadowColor = "transparent"
  }
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isCentroid(obj: any): boolean {
  return obj.constructor._centroid
}

// prettier-ignore
// eslint-disable-next-line @typescript-eslint/ban-types
export class Shape<PersonalAttrs extends Record<string, unknown> = {}>
// prettier-ignore
implements Container {
  static readonly _centroid: boolean = false

  public readonly attrs: ReturnType<
    typeof reactive<CommonAttrs & PersonalAttrs>
  >

  public readonly [BOUNCE_CLIENT_RECT]: ComputedRef<Rect>

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  private readonly [CONTEXT_CACHE] = document.createElement("canvas").getContext("2d")!
  private readonly [COMPUTED_CACHE]: ComputedRef<boolean>
  private readonly [CONTEXT_CACHE_SIZE]: ComputedRef<
    Pick<Rect, "width" | "height">
  >

  private readonly [EMITTER] = mitt<{
    resize: Event
  }>()

  private readonly scope = new EffectScope(true) as unknown as {
    active: boolean
    on: () => void
    off: () => void
    stop: () => void
  }

  protected _sceneFunc?(context: CanvasRenderingContext2D): void

  constructor(attrs: CommonAttrs<Shape> & PersonalAttrs) {
    this.scope.on()

    this.attrs = reactive(attrs)

    this[COMPUTED_CACHE] = computed<boolean>(() => {
      // ...
      if (this.attrs.perfectDrawEnabled !== false) {
        const ctx = this[CONTEXT_CACHE]

        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
        this[DRAW_CONTEXT_ON_SANDBOX](ctx)
      }

      return false
    })

    this[BOUNCE_CLIENT_RECT] = computed<Rect>(() => this.getClientRect())
    this[CONTEXT_CACHE_SIZE] = computed(() => {
      const { width, height } = this[BOUNCE_CLIENT_RECT].value
      const adjust = (this.attrs.strokeWidth ?? 1) * 2
      return {
        width: width + adjust,
        height: height + adjust
      }
    })

    // try watchEffect
    watchEffect(() => {
      // reactive
      if (this.attrs.perfectDrawEnabled !== false) {
        const ctx = this[CONTEXT_CACHE]
        const { width, height } = this[CONTEXT_CACHE_SIZE].value
        ;[ctx.canvas.width, ctx.canvas.height] = [width, height]

        this[EMITTER].emit("resize", createEvent("resize", ctx.canvas))
        console.log(
          "[cache::shape]: size changed %sx%s",
          ctx.canvas.width,
          ctx.canvas.height
        )
      }
    })

    this.scope.off()
  }

  protected getFill(context: CanvasRenderingContext2D) {
    // eslint-disable-next-line functional/no-let
    let style: FillStyle | void
    // "color" | "linear-gradient" | "radial-gradient" | "pattern"
    // fill pattern is preferred
    // các tổ hợp của nó dunce ưu tied
    switch (this.attrs.fillEnabled !== false && getFillPriority(this.attrs)) {
      case "color":
        style = this.attrs.fill
        break
      case "pattern":
        if (this.attrs.fillPatternImage !== undefined) {
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          style = context.createPattern(
            this.attrs.fillPatternImage,
            this.attrs.fillPattern?.repeat ?? "repeat"
          )!
          if (
            this.attrs.fillPattern &&
            existsTransform(this.attrs.fillPattern, true)
          )
            style.setTransform(createTransform(this.attrs.fillPattern, true))
        }
        break
      case "linear-gradient":
        if (this.attrs.fillLinearGradient !== undefined) {
          style = context.createLinearGradient(
            this.attrs.fillLinearGradient.start.x,
            this.attrs.fillLinearGradient.start.y,
            this.attrs.fillLinearGradient.end.x,
            this.attrs.fillLinearGradient.end.y
          )
          this.attrs.fillLinearGradient.colorStops.forEach(([color, point]) => {
            ;(style as CanvasGradient).addColorStop(color, point)
          })
        }
        break
      case "radial-gradient":
        if (this.attrs.fillRadialGradient !== undefined) {
          style = context.createRadialGradient(
            this.attrs.fillRadialGradient.start.x,
            this.attrs.fillRadialGradient.start.y,
            this.attrs.fillRadialGradient.startRadius,
            this.attrs.fillRadialGradient.end.x,
            this.attrs.fillRadialGradient.end.y,
            this.attrs.fillRadialGradient.endRadius
          )
          this.attrs.fillRadialGradient.colorStops.forEach(([color, point]) => {
            ;(style as CanvasGradient).addColorStop(color, point)
          })
        }
        break
    }

    return style
  }

  protected fillScene(context: CanvasRenderingContext2D, path?: Path2D) {
    const style = this.getFill(context)
    context.fillStyle = style ?? "transparent"
    if (style) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      context.fill(path!)
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected getStroke(_context: CanvasRenderingContext2D) {
    return this.attrs.strokeEnabled !== false ? this.attrs.stroke : undefined
  }

  protected strokeScene(context: CanvasRenderingContext2D) {
    const style = this.getStroke(context)

    context.strokeStyle = style ?? "transparent"
    if (style) context.stroke()
  }

  protected fillStrokeScene(context: CanvasRenderingContext2D) {
    const shadowForStrokeEnabled = this.attrs.shadowForStrokeEnabled ?? true
    if (this.attrs.fillAfterStrokeEnabled) {
      if (shadowForStrokeEnabled) {
        drawShadow(context, this.attrs)
        this.strokeScene(context)
      } else {
        this.strokeScene(context)
        drawShadow(context, this.attrs)
      }
      this.fillScene(context)
    } else {
      drawShadow(context, this.attrs)
      this.fillScene(context)
      if (!shadowForStrokeEnabled) {
        context.shadowBlur = 0
        context.shadowColor = "transparent"
      }
      this.strokeScene(context)
    }
  }

  protected getSize() {
    return {
      width: this.attrs.width as number,
      height: this.attrs.height as number
    }
  }

  public getRect() {
    const size = this.getSize()
    const centroid = isCentroid(this)

    return {
      x: centroid ? -size.width / 2 : 0,
      y: centroid ? -size.height / 2 : 0,
      width: size.width,
      height: size.height
    }
  }

  public getClientRect(config: GetClientRectOptions = {}) {
    const fillRect = this.getRect()

    const applyStroke =
      !config.skipStroke &&
      (this.attrs.strokeEnabled ?? true) &&
      this.attrs.stroke !== undefined
    const strokeWidth = (applyStroke && (this.attrs.strokeWidth ?? 1)) || 0

    const fillAndStrokeWidth = fillRect.width + strokeWidth
    const fillAndStrokeHeight = fillRect.height + strokeWidth

    const applyShadow =
      !config.skipShadow &&
      this.attrs.shadowEnabled !== false &&
      this.attrs.shadow !== undefined
    const shadowOffsetX = applyShadow ? this.attrs.shadow?.x ?? 0 : 0
    const shadowOffsetY = applyShadow ? this.attrs.shadow?.y ?? 0 : 0

    const preWidth = fillAndStrokeWidth + Math.abs(shadowOffsetX)
    const preHeight = fillAndStrokeHeight + Math.abs(shadowOffsetY)

    const blurRadius = (applyShadow && (this.attrs.shadow?.blur ?? 0)) || 0

    const width = preWidth + blurRadius * 2
    const height = preHeight + blurRadius * 2

    const rect = {
      width,
      height,
      x:
        -(strokeWidth / 2 + blurRadius) +
        Math.min(shadowOffsetX, 0) +
        fillRect.x,
      y:
        -(strokeWidth / 2 + blurRadius) +
        Math.min(shadowOffsetY, 0) +
        fillRect.y
    }

    const applyTransform =
      !config.skipTransform && existsTransform(this.attrs, false)
    if (applyTransform) {
      return transformedRect(
        rect,
        createTransform(this.attrs, !this[CONTEXT_CACHE])
      )
    }

    return rect
  }

  // or context cache or context draw

  private [DRAW_CONTEXT_ON_SANDBOX](context: CanvasRenderingContext2D) {
    console.log("[sandbox::shape]: draw context on sandbox")
    const isCache = !!this[CONTEXT_CACHE]
    const scene = this.attrs.sceneFunc || this._sceneFunc

    if (!scene) return

    // // eslint-disable-next-line functional/no-let
    // let transX: number, transY: number;
    // if (this._centroid) {
    //   const { x, y } = this.getSelfRect();
    //   [transX, transY] = [x, y];
    //   context.translate(-x, -y);
    // }\
    const clientRect = this[BOUNCE_CLIENT_RECT].value
    const adjust = isCache ? this.attrs.strokeWidth ?? 1 : 0
    const [transX, transY] = [clientRect.x - adjust, clientRect.y - adjust]
    context.translate(-transX, -transY)

    const needUseTransform = existsTransform(this.attrs, !isCache) && !isCache
    const needSetAlpha = this.attrs.opacity !== undefined
    const useFilter = this.attrs.filter !== undefined
    // eslint-disable-next-line functional/no-let
    let backupTransform, backupAlpha: number, backupFilter: string

    if (needSetAlpha) {
      backupAlpha = context.globalAlpha
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      context.globalAlpha = this.attrs.opacity!
    }
    if (needUseTransform) {
      backupTransform = context.getTransform()

      context.setTransform(createTransform(this.attrs, !isCache))
    }
    if (useFilter) {
      backupFilter = context.filter

      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      context.filter = createFilter(this.attrs.filter!)
    }

    context.beginPath()

    setLineStyle(context, this.attrs)
    scene?.call(this, context)
    // this.fillStrokeScene(context);

    context.closePath()

    if (useFilter) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      context.filter = backupFilter!
    }
    if (needUseTransform) context.setTransform(backupTransform)

    if (needSetAlpha) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      context.globalAlpha = backupAlpha!
    }
    // if (this._centroid) {
    //   // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    //   context.translate(transX!, transY!);
    // }
    context.translate(transX, transY)
  }

  public draw(context: CanvasRenderingContext2D) {
    if (this.attrs.visible === false) return

    if (this.attrs.perfectDrawEnabled !== false) {
      // eslint-disable-next-line no-unused-expressions
      this[COMPUTED_CACHE].value // get by draw cache
      // finished drawing in the cache
      // draw to main context
      const { x, y } = this[BOUNCE_CLIENT_RECT].value

      const adjust = this.attrs.strokeWidth ?? 1
      context.drawImage(
        this[CONTEXT_CACHE].canvas,
        this.attrs.x - adjust + x,
        this.attrs.y - adjust + y
      )
    } else {
      // キャッシュさせないでください
      this[DRAW_CONTEXT_ON_SANDBOX](context)
    }
  }

  protected getHitStroke() {
    return (
      ((this.attrs.strokeHitEnabled !== false
        ? this.attrs.hitStrokeWidth ?? this.attrs.strokeWidth
        : this.attrs.strokeWidth) ?? 1) - 1
    )
  }

  // @overwrite
  public isPressedPoint(x: number, y: number): boolean {
    const hitStroke = this.getHitStroke()

    const selfRect = this.getRect()

    return pointInBox(
      x,
      y,
      this.attrs.x + selfRect.x - hitStroke,
      this.attrs.y + selfRect.y - hitStroke,
      selfRect.width + hitStroke,
      selfRect.height + hitStroke
    )
  }

  public destroy() {
    this.scope.stop()
  }
}
