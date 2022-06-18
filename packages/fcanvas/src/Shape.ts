import { ContainerNode } from "./Container"
import { Group } from "./Group"
import type { Layer } from "./Layer"
import { Utils } from "./Utils"
import type { OptionFilter } from "./helpers/createFilter"
import { createFilter } from "./helpers/createFilter"
import type { OptionTransform } from "./helpers/createTransform"
import { createTransform } from "./helpers/createTransform"
import { existsTransform } from "./helpers/existsTransform"
import { pointInBox } from "./helpers/pointInBox"
import { setNeedReloadParentTrue } from "./helpers/setNeedReloadParentTrue"
import { transformedRect } from "./helpers/transformerRect"
import { transparent } from "./packages/Colors"
import type { ClientRectOptions } from "./types/ClientRectOptions"
import type { Offset } from "./types/Offset"
import type Props from "./types/Props"
import type { Size } from "./types/Size"

// add ctx.filter
type Color = string
type FillStyle = CanvasGradient | CanvasPattern | Color

type bool = boolean

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

type AttrsDefault = Offset & {
  fillAfterStrokeEnabled?: boolean
  fillEnabled?: bool
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
  sceneFunc?: (context: CanvasRenderingContext2D) => void
} & Partial<FillModeMixture> /* & FillModeMonopole */ & {
    shadowEnabled?: boolean
    shadow?: Partial<Offset> & {
      color: Color
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

const EmptyArray: Array<number> = []

export type AttrsShapeSelf<
  T,
  AttrsRefs extends Props,
  AttrsRaws extends Props
> = AttrsDefault &
  T & {
    refs?: AttrsRefs
    raws?: AttrsRaws
  }

interface EventsCustomShape {
  readonly "resize-self": void
}

export class Shape<
  AttrsCustom extends Props = {
    width: number
    height: number
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
  EventsCustomM extends Record<string, any> = {},
  AttrsRefs extends Props = Props,
  AttrsRaws extends Props = Props,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  IParent extends Layer | Group<any> = Layer | Group,
  EventsCustom extends EventsCustomM & EventsCustomShape = EventsCustomM &
    EventsCustomShape
> extends ContainerNode<
  AttrsShapeSelf<AttrsCustom, AttrsRefs, AttrsRaws>,
  EventsCustom,
  IParent,
  AttrsRefs,
  AttrsRaws
> {
  static readonly sizes: readonly string[] = ["width", "height"]
  static readonly type: string = "Shape"

  public readonly _centroid: boolean = false

  protected _sceneFunc?(_context: CanvasRenderingContext2D): void

  #context?: CanvasRenderingContext2D

  constructor(attrs: AttrsShapeSelf<AttrsCustom, AttrsRefs, AttrsRaws>) {
    super(attrs, (prop) => {
      if (!this.#context || (prop !== "x" && prop !== "y"))
        this.currentNeedReload = true

      setNeedReloadParentTrue(this.parents)

      const sizeChanged = (
        this.constructor as unknown as typeof Shape
      ).sizes.some(
        (test) =>
          test === (prop as string) || (prop as string).startsWith(`${test}.`)
      )

      if (sizeChanged) this.onresize()

      if (sizeChanged || prop === "x" || prop === "y") {
        this.parents.forEach((parent) => {
          if (parent instanceof Group) parent._onChildResize()
        })
      }
    })

    if (this.attrs.perfectDrawEnabled !== false)
      this.#context = Utils.createCanvas().getContext("2d") ?? undefined

    this.onresize()
  }

  protected size(): Size {
    return {
      width: this.attrs.width as number,
      height: this.attrs.height as number
    }
  }

  public getSelfRect(): Offset & Size {
    const size = this.size()

    return {
      x: this._centroid ? -size.width / 2 : 0,
      y: this._centroid ? -size.height / 2 : 0,
      width: size.width,
      height: size.height
    }
  }

  public getClientRect(config: ClientRectOptions = {}) {
    const fillRect = this.getSelfRect()

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
    if (applyTransform)
      return transformedRect(rect, createTransform(this.attrs, !this.#context))

    return rect
  }

  private onresize() {
    // reactive
    if (this.attrs.perfectDrawEnabled !== false) {
      const { width, height } = this.getClientRect()
      const adjust = (this.attrs.strokeWidth ?? 1) * 2
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      ;[this.#context!.canvas.width, this.#context!.canvas.height] = [
        width + adjust,
        height + adjust
      ]
    }
    this.emit("resize-self", undefined)
  }

  private getSceneFunc() {
    return this.attrs.sceneFunc || this._sceneFunc
  }

  private getFillPriority(): FillModeMixture["fillPriority"] {
    if (this.attrs.fillPriority)
      return this.attrs.fillPriority as FillModeMixture["fillPriority"]

    if (this.attrs.fillPatternImage !== undefined) return "pattern"

    if (this.attrs.fillLinearGradient !== undefined) return "linear-gradient"

    if (this.attrs.fillRadialGradient !== undefined) return "radial-gradient"

    return "color"
  }

  protected getFill(context: CanvasRenderingContext2D) {
    // eslint-disable-next-line functional/no-let
    let style: FillStyle | void
    // "color" | "linear-gradient" | "radial-gradient" | "pattern"
    // fill pattern is preferred
    // các tổ hợp của nó dunce ưu tied
    switch (this.attrs.fillEnabled !== false && this.getFillPriority()) {
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
    // eslint-disable-next-line functional/immutable-data
    context.fillStyle = style ?? transparent
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

    // eslint-disable-next-line functional/immutable-data
    context.strokeStyle = style ?? transparent
    if (style) context.stroke()
  }

  private lineSet(context: CanvasRenderingContext2D) {
    if (this.attrs.strokeEnabled === false) return

    if (this.attrs.strokeWidth !== undefined) {
      // eslint-disable-next-line functional/immutable-data
      context.lineWidth = this.attrs.strokeWidth
    }

    // eslint-disable-next-line functional/immutable-data
    context.lineJoin = this.attrs.lineJoin ?? "miter"
    // eslint-disable-next-line functional/immutable-data
    context.lineCap = this.attrs.lineCap ?? "butt"

    if (this.attrs.dashEnabled ?? true)
      context.setLineDash(this.attrs.dash ?? EmptyArray)
    else if (context.getLineDash().length) context.setLineDash(EmptyArray)
  }

  protected fillStrokeScene(context: CanvasRenderingContext2D) {
    const shadowForStrokeEnabled = this.attrs.shadowForStrokeEnabled ?? true
    if (this.attrs.fillAfterStrokeEnabled) {
      if (shadowForStrokeEnabled) {
        this.shadowScene(context)
        this.strokeScene(context)
      } else {
        this.strokeScene(context)
        this.shadowScene(context)
      }
      this.fillScene(context)
    } else {
      this.shadowScene(context)
      this.fillScene(context)
      if (!shadowForStrokeEnabled) {
        // eslint-disable-next-line functional/immutable-data
        context.shadowBlur = 0
        // eslint-disable-next-line functional/immutable-data
        context.shadowColor = transparent
      }
      this.strokeScene(context)
    }
  }

  private shadowScene(context: CanvasRenderingContext2D) {
    if (this.attrs.shadowEnabled !== false && this.attrs.shadow !== undefined) {
      // eslint-disable-next-line functional/immutable-data
      context.shadowColor = this.attrs.shadow.color
      // eslint-disable-next-line functional/immutable-data
      context.shadowOffsetX = this.attrs.shadow?.x ?? 0
      // eslint-disable-next-line functional/immutable-data
      context.shadowOffsetY = this.attrs.shadow?.y ?? 0
      // eslint-disable-next-line functional/immutable-data
      context.shadowBlur = this.attrs.shadow.blur ?? 0
    } else {
      if (context.shadowColor !== transparent) {
        // eslint-disable-next-line functional/immutable-data
        context.shadowColor = transparent
      }
    }
  }

  private drawInSandBox(context: CanvasRenderingContext2D) {
    const scene = this.getSceneFunc()

    if (!scene) return

    // // eslint-disable-next-line functional/no-let
    // let transX: number, transY: number;
    // if (this._centroid) {
    //   const { x, y } = this.getSelfRect();
    //   [transX, transY] = [x, y];
    //   context.translate(-x, -y);
    // }
    const clientRect = this.getClientRect()
    const adjust = this.#context ? this.attrs.strokeWidth ?? 1 : 0
    const [transX, transY] = [clientRect.x - adjust, clientRect.y - adjust]
    context.translate(-transX, -transY)

    const needUseTransform =
      existsTransform(this.attrs, !this.#context) && !this.#context
    const needSetAlpha = this.attrs.opacity !== undefined
    const useFilter = this.attrs.filter !== undefined
    // eslint-disable-next-line functional/no-let
    let backupTransform, backupAlpha: number, backupFilter: string

    if (needSetAlpha) {
      backupAlpha = context.globalAlpha
      // eslint-disable-next-line functional/immutable-data, @typescript-eslint/no-non-null-assertion
      context.globalAlpha = this.attrs.opacity!
    }
    if (needUseTransform) {
      backupTransform = context.getTransform()

      context.setTransform(createTransform(this.attrs, !this.#context))
    }
    if (useFilter) {
      backupFilter = context.filter

      // eslint-disable-next-line functional/immutable-data, @typescript-eslint/no-non-null-assertion
      context.filter = createFilter(this.attrs.filter!)
    }

    context.beginPath()

    this.lineSet(context)
    scene?.call(this, context)
    // this.fillStrokeScene(context);

    context.closePath()

    if (useFilter) {
      // eslint-disable-next-line functional/immutable-data, @typescript-eslint/no-non-null-assertion
      context.filter = backupFilter!
    }
    if (needUseTransform) context.setTransform(backupTransform)

    if (needSetAlpha) {
      // eslint-disable-next-line functional/immutable-data, @typescript-eslint/no-non-null-assertion
      context.globalAlpha = backupAlpha!
    }
    // if (this._centroid) {
    //   // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    //   context.translate(transX!, transY!);
    // }
    context.translate(transX, transY)
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

    const selfRect = this.getSelfRect()

    return pointInBox(
      x,
      y,
      this.attrs.x + selfRect.x - hitStroke,
      this.attrs.y + selfRect.y - hitStroke,
      selfRect.width + hitStroke,
      selfRect.height + hitStroke
    )
  }

  draw(context: CanvasRenderingContext2D) {
    if (this.attrs.visible === false) return

    // ...
    if (this.attrs.perfectDrawEnabled !== false) {
      // caching mode
      if (this.currentNeedReload) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        this.#context!.clearRect(
          0,
          0,
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          this.#context!.canvas.width,
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          this.#context!.canvas.height
        )
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        this.drawInSandBox(this.#context!)
      }

      // finished drawing in the cache
      // draw to main context
      const { x, y } = this.getClientRect()
      const adjust = this.attrs.strokeWidth ?? 1
      context.drawImage(
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        this.#context!.canvas,
        this.attrs.x - adjust + x,
        this.attrs.y - adjust + y
      )
    } else {
      // キャッシュさせないでください
      this.drawInSandBox(context)
    }

    this.currentNeedReload = false
  }
}
