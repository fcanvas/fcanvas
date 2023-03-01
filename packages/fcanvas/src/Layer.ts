import type {
  ComputedRef,
  ShallowReactive,
  UnwrapNestedRefs
} from "@vue/reactivity"
import { computed, reactive, ref, unref } from "@vue/reactivity"

import type { Group } from "./Group"
import type { Shape } from "./Shape"
import { APIGroup } from "./apis/APIGroup"
import { UIEvent } from "./apis/UIEvent"
import { effectScopeFlat } from "./apis/effectScopeFlat"
import { CONFIGS, isDOM } from "./configs"
import { isDev } from "./env"
import type { WatchStopHandle } from "./fns/watch"
import { watch, watchEffect } from "./fns/watch"
import type { DrawLayerAttrs } from "./helpers/drawLayer"
import { drawLayer } from "./helpers/drawLayer"
import { pointInBox } from "./helpers/pointInBox"
import { isCanvasDOM } from "./logic/isCanvasDOM"
import {
  BOUNCE_CLIENT_RECT,
  BOUNDING_CLIENT_RECT,
  CANVAS_ELEMENT,
  CHILD_NODE,
  COMPUTED_CACHE,
  CONTEXT_CACHE,
  DRAW_CONTEXT_ON_SANDBOX,
  SCOPE
} from "./symbols"
import type { CommonShapeEvents } from "./type/CommonShapeEvents"
import type { Offset } from "./type/Offset"
import type { Rect } from "./type/Rect"
import type { ReactiveType } from "./type/fn/ReactiveType"
import { extendTarget } from "./utils/extendTarget"

type PersonalAttrs = Partial<Offset> &
  DrawLayerAttrs & {
    clearBeforeDraw?: boolean
    autoDraw?: boolean
    width?: number
    height?: number
    visible?: boolean
    offscreen?: boolean
  }

const WAIT_DRAWING = Symbol("wait drawing")
const ID_REQUEST_FRAME = Symbol("ID_REQUEST_FRAME")

// eslint-disable-next-line functional/no-let
let countLayers = 0
export class Layer extends APIGroup<Shape | Group, CommonShapeEvents> {
  static readonly type: string = "Layer"

  public readonly uid = ++countLayers + ""
  public readonly $: UnwrapNestedRefs<PersonalAttrs>
  public get attrs() {
    return this.$
  }

  public readonly markChange: () => number

  public readonly [BOUNCE_CLIENT_RECT]: ComputedRef<Rect>
  public readonly [BOUNDING_CLIENT_RECT]: ComputedRef<Rect>

  // private readonly [CANVAS_ELEMENT]: HTMLCanvasElement | OffscreenCanvas
  public [CANVAS_ELEMENT]: HTMLCanvasElement | OffscreenCanvas

  private readonly [COMPUTED_CACHE]: ComputedRef<number>

  private readonly [SCOPE] = effectScopeFlat()

  private [WAIT_DRAWING] = false
  private [ID_REQUEST_FRAME]: number | null = null

  constructor(attrs: ReactiveType<PersonalAttrs> = {}) {
    super()
    this[SCOPE].fOn()

    this[CANVAS_ELEMENT] =
      !isDOM || unref(attrs.offscreen)
        ? CONFIGS.createOffscreenCanvas()
        : CONFIGS.createCanvas()
    this.$ = reactive(attrs)

    const canvas = this[CANVAS_ELEMENT]
    if (isCanvasDOM(canvas)) {
      canvas.style.cssText = "position: absolute; margin: 0; padding: 0"
      watchEffect(() => {
        canvas.style.left = (this.$.x ?? 0) + "px"
        canvas.style.top = (this.$.y ?? 0) + "px"
      })
      // eslint-disable-next-line functional/no-let
      let displayBp = ""
      watchEffect(() => {
        displayBp = canvas.style.display
        const display = getComputedStyle(canvas).getPropertyValue("display")

        if (this.$.visible !== false) {
          if (display === "none") canvas.style.display = "block"
          else canvas.style.display = displayBp === "none" ? "" : displayBp

          return
        }

        if (display === "none") return

        canvas.style.display = "none"
      })
    }

    this[BOUNCE_CLIENT_RECT] = computed<Rect>(() => this.getClientRect())
    this[BOUNDING_CLIENT_RECT] = computed<Rect>(() => {
      const { x = 0, y = 0 } = this.$
      const { width, height } = this[BOUNCE_CLIENT_RECT].value

      return {
        x,
        y,
        width,
        height
      }
    })
    const _countMarkChange = ref(0)
    // eslint-disable-next-line functional/no-let
    let countDraw = 0
    this[COMPUTED_CACHE] = computed<number>(() => {
      const ctx = this[CONTEXT_CACHE]
      // eslint-disable-next-line no-unused-expressions
      _countMarkChange.value
      if (this.$.clearBeforeDraw !== false)
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
      this[DRAW_CONTEXT_ON_SANDBOX](ctx)

      return ++countDraw
    })
    this.markChange = () => ++_countMarkChange.value

    // try watchEffect
    watchEffect(() => {
      const { width, height } = this.$
      const useConfig = width !== undefined && height !== undefined

      if (!useConfig) return

      // reactive
      const canvas = this[CANVAS_ELEMENT]
      ;[canvas.width, canvas.height] = [width, height]

      this.emit("resize", extendTarget(new UIEvent("resize"), canvas))
      if (isDev) {
        console.log(
          "[cache::layer]: size changed %sx%s",
          canvas.width,
          canvas.height
        )
      }
    })

    this[SCOPE].fOff()
  }

  private _context2d:
    | CanvasRenderingContext2D
    | OffscreenCanvasRenderingContext2D
    | null = null

  public get [CONTEXT_CACHE]() {
    return (this._context2d = this[CANVAS_ELEMENT].getContext("2d") as
      | CanvasRenderingContext2D
      | OffscreenCanvasRenderingContext2D)
  }

  public toCanvas() {
    return this[CANVAS_ELEMENT]
  }

  private [DRAW_CONTEXT_ON_SANDBOX](
    context: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D
  ) {
    drawLayer(context, this.$, this[CHILD_NODE], this)
  }

  public getBoundingClientRect() {
    return this[BOUNDING_CLIENT_RECT].value
  }

  private lastIdDraw = 0
  public draw() {
    if (this.$.visible === false) return

    const currentId = this[COMPUTED_CACHE].value
    const changed = currentId !== this.lastIdDraw
    this.lastIdDraw = currentId

    return changed
  }

  private _resolveTick: (() => void) | void | undefined
  private _rejectTick: (() => void) | void | undefined
  private _promiseTick: Promise<void> | void | undefined

  public nextTick(): Promise<void> {
    if (this._promiseTick) return this._promiseTick

    return (this._promiseTick = new Promise<void>((resolve, reject) => {
      ;[this._resolveTick, this._rejectTick] = [resolve, reject]
    }).finally(() => {
      ;[this._resolveTick, this._rejectTick] = [undefined, undefined]
    }))
  }

  private stopWaitDraw?: WatchStopHandle
  public batchDraw() {
    if (!this[WAIT_DRAWING]) {
      this[WAIT_DRAWING] = true
      this[ID_REQUEST_FRAME] = requestAnimationFrame(() => {
        if (!this[WAIT_DRAWING]) return

        const changed = this.draw()
        this[WAIT_DRAWING] = false
        this._resolveTick?.()

        if (!changed) {
          this.stopWaitDraw = watch(
            () => this[COMPUTED_CACHE].value,
            () => this.batchDraw()
          )
          return
        }

        this.batchDraw()
      })
    }
  }

  public stopDraw() {
    if (this.stopWaitDraw) {
      this.stopWaitDraw?.()
      this.stopWaitDraw = undefined
    }
    if (!this[ID_REQUEST_FRAME]) return

    const success = !this[WAIT_DRAWING]

    this[WAIT_DRAWING] = false
    cancelAnimationFrame(this[ID_REQUEST_FRAME])

    if (success) this._resolveTick?.()
    else this._rejectTick?.()
  }

  public add(node: Shape | Group) {
    // eslint-disable-next-line functional/no-let
    let results: ShallowReactive<Set<Shape | Group<Shape>>>
    if (this[CHILD_NODE].size < (results = super.add(node)).size) {
      // success
      node._parents++
    }

    return results
  }

  public delete(node: Shape | Group) {
    if (super.delete(node)) {
      // success
      node._parents--
      if (node._parents <= 0) node.destroy()

      return true
    }

    return false
  }

  public isPressedPoint(x: number, y: number): boolean {
    const { x: xd = 0, y: yd = 0 } = this.$
    const { width, height } = this[CANVAS_ELEMENT]

    return pointInBox(x, y, xd, yd, width, height)
  }

  public destroy(): void {
    super.destroy()
    this.stopDraw()
    this[SCOPE].stop()
    const canvas = this[CANVAS_ELEMENT]
    if (isCanvasDOM(canvas)) canvas.remove()
  }
}
