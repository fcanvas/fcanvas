import type { ComputedRef, Ref, UnwrapNestedRefs } from "@vue/reactivity"
import { computed, reactive, ref, toRaw, unref } from "@vue/reactivity"
import type gsap from "gsap"
import { watchEffect } from "src/fns/watch"

import type { Group } from "./Group"
import type { Layer } from "./Layer"
import { APIEvent } from "./apis/APIEvent"
import { UIEvent } from "./apis/UIEvent"
import { effectScopeFlat } from "./apis/effectScopeFlat"
import { createContext2D, isDOM } from "./configs"
import { _setCurrentShape } from "./currentShape"
import { getImage } from "./fns/loadImage"
import { convertToDegrees } from "./helpers/convertToDegrees"
import { createFilter } from "./helpers/createFilter"
import { createTransform } from "./helpers/createTransform"
import { existsTransform } from "./helpers/existsTransform"
import { pointInBox } from "./helpers/pointInBox"
import { transformedRect } from "./helpers/transformerRect"
import {
  BOUNCE_CLIENT_RECT,
  BOUNDING_CLIENT_RECT,
  COMPUTED_CACHE,
  CONTEXT_CACHE,
  CONTEXT_CACHE_SIZE,
  DRAW_CONTEXT_ON_SANDBOX,
  REF_MARK_CHANGE,
  SCOPE
} from "./symbols"
import type {
  CommonShapeAttrs,
  FillModeMixture,
  FillStyle
} from "./type/CommonShapeAttrs"
import type { CommonShapeEvents } from "./type/CommonShapeEvents"
import type { GetClientRectOptions } from "./type/GetClientRectOptions"
import type { Rect } from "./type/Rect"
import type { Size } from "./type/Size"
import type { TorFnT } from "./type/TorFnT"
import type { ReactiveType } from "./type/fn/ReactiveType"
import { extendTarget } from "./utils/extendTarget"

function getFillPriority(
  attrs: Partial<
    Pick<
      CommonShapeAttrs,
      | "fillPriority"
      | "fillPattern"
      | "fillLinearGradient"
      | "fillRadialGradient"
    >
  >
): FillModeMixture["fillPriority"] {
  if (attrs.fillPriority)
    return attrs.fillPriority as FillModeMixture["fillPriority"]

  if (attrs.fillPattern) return "pattern"

  if (attrs.fillLinearGradient !== undefined) return "linear-gradient"

  if (attrs.fillRadialGradient !== undefined) return "radial-gradient"

  return "color"
}

function setLineStyle(
  context: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D,
  attrs: Partial<
    Pick<
      CommonShapeAttrs,
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
    if (attrs.dash) context.setLineDash(toRaw(attrs.dash))
  } else if (context.getLineDash().length) {
    context.setLineDash([])
  }
}
function drawShadow(
  context: CanvasRenderingContext2D,
  attrs: Partial<Pick<CommonShapeAttrs, "shadowEnabled" | "shadow">>
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

export class Shape<
  // eslint-disable-next-line @typescript-eslint/ban-types
  PersonalAttrs extends Record<string, unknown> = {}
> extends APIEvent<CommonShapeEvents> {
  static readonly type: string = "Shape"
  static readonly _centroid: boolean = false

  public readonly $: // eslint-disable-next-line no-use-before-define
  UnwrapNestedRefs<CommonShapeAttrs<PersonalAttrs> & ThisType<Shape>>

  public get attrs() {
    return this.$
  }

  public get type(): string {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (this.constructor as any).type
  }

  // How many fathers does this shape have?
  public _parents = 0

  public readonly [BOUNCE_CLIENT_RECT]: ComputedRef<Rect>
  public readonly [BOUNDING_CLIENT_RECT]: ComputedRef<Rect>

  public readonly [CONTEXT_CACHE]: ReturnType<typeof createContext2D>

  private readonly [COMPUTED_CACHE]: ComputedRef<boolean>
  private readonly [CONTEXT_CACHE_SIZE]: ComputedRef<Size>
  private readonly [REF_MARK_CHANGE]: Ref<number>

  protected readonly [SCOPE] = effectScopeFlat()

  protected _sceneFunc?(
    context: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D
  ): void

  constructor(
    attrs: TorFnT<ReactiveType<CommonShapeAttrs<PersonalAttrs>>, Shape>,
    flush: "pre" | "post" | "sync" = "post"
  ) {
    super()

    this[SCOPE].fOn()

    if (typeof attrs === "function") {
      // =========== current shape ===========
      _setCurrentShape(this)
      // =====================================
      this.$ = reactive(attrs(this) as CommonShapeAttrs<PersonalAttrs>)
      // =========== current shape ===========
      _setCurrentShape(null)
      // =====================================
    } else {
      this.$ = reactive(attrs as CommonShapeAttrs<PersonalAttrs>)
    }

    this[CONTEXT_CACHE] = createContext2D(
      (!isDOM || unref(this.$.offscreen) !== false) as boolean
    )

    this[BOUNCE_CLIENT_RECT] = computed<Rect>(() => this.getClientRect())
    this[BOUNDING_CLIENT_RECT] = computed<Rect>(() => {
      const { x, y } = this.$
      const { x: offX, y: offY, width, height } = this[BOUNCE_CLIENT_RECT].value

      return {
        x: x + offX,
        y: y + offY,
        width,
        height
      }
    })
    this[REF_MARK_CHANGE] = ref(0)
    this[COMPUTED_CACHE] = computed<boolean>(() => {
      // ...
      // eslint-disable-next-line no-unused-expressions
      this[REF_MARK_CHANGE].value
      if (this.$.perfectDrawEnabled !== false) {
        const ctx = this[CONTEXT_CACHE]

        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
        this[DRAW_CONTEXT_ON_SANDBOX](ctx)
      }

      return false
    })

    this[CONTEXT_CACHE_SIZE] = computed(() => {
      const { width, height } = this[BOUNCE_CLIENT_RECT].value
      const adjust = (this.$.strokeWidth ?? 1) * 2
      return {
        width: width + adjust,
        height: height + adjust
      }
    })

    // try watchEffect
    watchEffect(
      () => {
        // reactive
        if (this.$.perfectDrawEnabled !== false) {
          const ctx = this[CONTEXT_CACHE]
          const { width, height } = this[CONTEXT_CACHE_SIZE].value
          ;[ctx.canvas.width, ctx.canvas.height] = [width, height]
          this.markChange()

          this.emit("resize", extendTarget(new UIEvent("resize"), ctx.canvas))
          if (__DEV_LIB__) {
            console.log(
              "[cache::shape]: size changed %sx%s",
              ctx.canvas.width,
              ctx.canvas.height
            )
          }
        }
      },
      { flush }
    )

    this[SCOPE].fOff()
  }

  protected getFill(context: CanvasRenderingContext2D) {
    // eslint-disable-next-line functional/no-let
    let style: FillStyle | void
    // "color" | "linear-gradient" | "radial-gradient" | "pattern"
    // fill pattern is preferred
    // các tổ hợp của nó dunce ưu tied
    switch (this.$.fillEnabled !== false && getFillPriority(this.$)) {
      case "color":
        style = this.$.fill
        break
      case "pattern":
        if (this.$.fillPattern) {
          const { image } = this.$.fillPattern
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          style = context.createPattern(
            typeof image === "string" ? getImage(image) : image,
            this.$.fillPattern?.repeat ?? null
          )!
          if (existsTransform(this.$.fillPattern, true)) {
            const transform = createTransform(this.$.fillPattern, true)
            if (transform) style.setTransform(transform)
          }
        }
        break
      case "linear-gradient":
        if (this.$.fillLinearGradient !== undefined) {
          const { fillLinearGradient } = this.$
          style = context.createLinearGradient(
            fillLinearGradient.start.x,
            fillLinearGradient.start.y,
            fillLinearGradient.end.x,
            fillLinearGradient.end.y
          )
          fillLinearGradient.colorStops.forEach(([point, color]) => {
            ;(style as CanvasGradient).addColorStop(point, color)
          })
        }
        break
      case "radial-gradient":
        if (this.$.fillRadialGradient !== undefined) {
          const { fillRadialGradient } = this.$
          style = context.createRadialGradient(
            fillRadialGradient.start.x,
            fillRadialGradient.start.y,
            fillRadialGradient.startRadius,
            fillRadialGradient.end.x,
            fillRadialGradient.end.y,
            fillRadialGradient.endRadius
          )
          fillRadialGradient.colorStops.forEach(([color, point]) => {
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
    return this.$.strokeEnabled !== false ? this.$.stroke : undefined
  }

  protected strokeScene(context: CanvasRenderingContext2D) {
    const style = this.getStroke(context)

    context.strokeStyle = style ?? "transparent"
    if (style) context.stroke()
  }

  protected fillStrokeScene(context: CanvasRenderingContext2D) {
    const shadowForStrokeEnabled = this.$.shadowForStrokeEnabled ?? true
    if (this.$.fillAfterStrokeEnabled) {
      if (shadowForStrokeEnabled) {
        drawShadow(context, this.$)
        this.strokeScene(context)
      } else {
        this.strokeScene(context)
        drawShadow(context, this.$)
      }
      this.fillScene(context)
    } else {
      drawShadow(context, this.$)
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
      width: this.$.width as number,
      height: this.$.height as number
    }
  }

  public markChange() {
    this[REF_MARK_CHANGE].value++
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
      (this.$.strokeEnabled ?? true) &&
      this.$.stroke !== undefined
    const strokeWidth = (applyStroke && (this.$.strokeWidth ?? 1)) || 0

    const fillAndStrokeWidth = fillRect.width + strokeWidth
    const fillAndStrokeHeight = fillRect.height + strokeWidth

    const applyShadow =
      !config.skipShadow &&
      this.$.shadowEnabled !== false &&
      this.$.shadow !== undefined
    const shadowOffsetX = applyShadow ? this.$.shadow?.x ?? 0 : 0
    const shadowOffsetY = applyShadow ? this.$.shadow?.y ?? 0 : 0

    const preWidth = fillAndStrokeWidth + Math.abs(shadowOffsetX)
    const preHeight = fillAndStrokeHeight + Math.abs(shadowOffsetY)

    const blurRadius = (applyShadow && (this.$.shadow?.blur ?? 0)) || 0

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
      !config.skipTransform && existsTransform(this.$, false)
    if (applyTransform) {
      const isCache = !!this[CONTEXT_CACHE]

      const matrix = new DOMMatrix()
      if (this.$.scale) matrix.scaleSelf(this.$.scale.x, this.$.scale.y)
      if (this.$.rotation) {
        const centroid = isCentroid(this)

        // eslint-disable-next-line functional/no-let
        let x: number, y: number
        if (!centroid) {
          x = width / 2
          y = height / 2
        }

        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        if (!centroid) matrix.translateSelf(x!, y!)
        matrix.rotateSelf(convertToDegrees(this.$.rotation))
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        if (!centroid) matrix.translateSelf(-x!, -y!)
      }
      if (this.$.offset) {
        matrix.translateSelf(
          (this.$.offset.x ?? 0) + (isCache ? 0 : this.$.x),
          (this.$.offset.y ?? 0) + (isCache ? 0 : this.$.y)
        )
      }
      if (this.$.skewX !== undefined) matrix.skewXSelf(this.$.skewX)
      if (this.$.skewY !== undefined) matrix.skewYSelf(this.$.skewY)

      return transformedRect(rect, matrix)
    }

    return rect
  }

  public get clientRect() {
    return this[BOUNCE_CLIENT_RECT].value
  }

  public get bounding() {
    return this[BOUNDING_CLIENT_RECT].value
  }

  public getBoundingClientRect() {
    return this[BOUNDING_CLIENT_RECT].value
  }

  public to(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    attrs: gsap.TweenVars &
      Partial<ReactiveType<CommonShapeAttrs<PersonalAttrs>>> & {
        keyframes?: (gsap.TweenVars &
          Partial<ReactiveType<CommonShapeAttrs<PersonalAttrs>>>)[]
      }
  ): gsap.core.Tween {
    // eslint-disable-next-line functional/no-throw-statement
    throw new Error(
      // eslint-disable-next-line quotes
      'You need to install the "@fcanvas/animate"  plugin to use this function.'
    )
  }

  // or context cache or context draw

  private [DRAW_CONTEXT_ON_SANDBOX](
    context: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D
  ) {
    if (__DEV_LIB__) console.log("[sandbox::shape]: draw context on sandbox")
    const isCache = !!this[CONTEXT_CACHE]
    const scene = this.$.sceneFunc || this._sceneFunc

    if (!scene) return

    // // eslint-disable-next-line functional/no-let
    // let transX: number, transY: number;
    // if (this._centroid) {
    //   const { x, y } = this.getSelfRect();
    //   [transX, transY] = [x, y];
    //   context.translate(-x, -y);
    // }\
    const clientRect = this[BOUNCE_CLIENT_RECT].value
    const adjust = isCache ? this.$.strokeWidth ?? 1 : 0
    const [transX, transY] = [clientRect.x - adjust, clientRect.y - adjust]
    context.translate(-transX, -transY)

    const needUseTransform = existsTransform(this.$, !isCache)
    const needSetAlpha = this.$.opacity !== undefined
    const useFilter = this.$.filter !== undefined
    // eslint-disable-next-line functional/no-let
    let backupTransform, backupAlpha: number, backupFilter: string

    if (needSetAlpha) {
      backupAlpha = context.globalAlpha
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      context.globalAlpha = this.$.opacity!
    }
    if (needUseTransform) {
      backupTransform = context.getTransform()
      const { width, height } = this.getRect()

      const matrix = new DOMMatrix(backupTransform.toString())
      if (this.$.scale) matrix.scaleSelf(this.$.scale.x, this.$.scale.y)

      if (this.$.rotation) {
        const centroid = isCentroid(this)

        // eslint-disable-next-line functional/no-let
        let x: number, y: number
        if (!centroid) {
          x = width / 2
          y = height / 2
        }

        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        if (!centroid) matrix.translateSelf(x!, y!)
        matrix.rotateSelf(convertToDegrees(this.$.rotation))
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        if (!centroid) matrix.translateSelf(-x!, -y!)
      }
      if (this.$.offset) {
        matrix.translateSelf(
          (this.$.offset.x ?? 0) + (isCache ? 0 : this.$.x),
          (this.$.offset.y ?? 0) + (isCache ? 0 : this.$.y)
        )
      }
      if (this.$.skewX !== undefined) matrix.skewXSelf(this.$.skewX)

      if (this.$.skewY !== undefined) matrix.skewYSelf(this.$.skewY)

      context.setTransform(matrix)
    }
    if (useFilter) {
      backupFilter = context.filter

      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      context.filter = createFilter(this.$.filter!)
    }

    context.beginPath()

    setLineStyle(context, this.$)
    scene.call(this, context)
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

  public draw(
    context: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D
  ) {
    if (this.$.visible === false) return

    if (this.$.perfectDrawEnabled !== false) {
      // eslint-disable-next-line no-unused-expressions
      this[COMPUTED_CACHE].value // get by draw cache
      // finished drawing in the cache
      // draw to main context
      const { x, y } = this[BOUNCE_CLIENT_RECT].value

      const adjust = this.$.strokeWidth ?? 1
      context.drawImage(
        this[CONTEXT_CACHE].canvas,
        this.$.x - adjust + x,
        this.$.y - adjust + y
      )
    } else {
      // キャッシュさせないでください
      this[DRAW_CONTEXT_ON_SANDBOX](context)
    }
  }

  protected getHitStroke() {
    return (
      ((this.$.strokeHitEnabled !== false
        ? this.$.hitStrokeWidth ?? this.$.strokeWidth
        : this.$.strokeWidth) ?? 1) - 1
    )
  }

  // @overwrite
  public isPressedPoint(x: number, y: number): boolean {
    const { x: xd, y: yd, width, height } = this.getBoundingClientRect()

    return pointInBox(x, y, xd, yd, width, height)
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public addTo(parent: Layer | Group<any, any>) {
    parent.add(this)
    return this
  }

  public destroy() {
    super.destroy()
    this[SCOPE].stop()
  }
}
