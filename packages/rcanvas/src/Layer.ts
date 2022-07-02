import type { ComputedRef } from "@vue/reactivity"
import { computed, EffectScope, reactive } from "@vue/reactivity"
import mitt from "mitt"
import { watchEffect, watchPostEffect } from "vue"

import { APIGroup } from "./APIGroup"
import type { Group } from "./Group"
import { createContextCacheSize } from "./Group"
import type { Shape } from "./Shape"
import type { DrawLayerAttrs } from "./helpers/drawLayer"
import { drawLayer } from "./helpers/drawLayer"
import {
  BOUNCE_CLIENT_RECT,
  CANVAS_ELEMENT,
  CHILD_NODE,
  COMPUTED_CACHE,
  CONTEXT_CACHE,
  CONTEXT_CACHE_SIZE,
  DRAW_CONTEXT_ON_SANDBOX,
  EMITTER,
  SCOPE
} from "./symbols"
import type { Offset } from "./type/Offset"
import type { Rect } from "./type/Rect"
import { createEvent } from "./utils/createEvent"

type PersonalAttrs = Partial<Offset> &
  DrawLayerAttrs & {
    clearBeforeDraw?: boolean
    width?: number
    height?: number
    visible?: boolean
  }

const WAIT_DRAWING = Symbol("wait drawing")
const ID_REQUEST_FRAME = Symbol("ID_REQUEST_FRAME")
export class Layer extends APIGroup<Shape | Group> {
  static readonly type: string = "Layer"

  public readonly attrs: ReturnType<typeof reactive<PersonalAttrs>>

  public readonly [BOUNCE_CLIENT_RECT]: ComputedRef<Rect>

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  private readonly [CONTEXT_CACHE] = document
    .createElement("canvas")
    .getContext("2d")!

  private readonly [COMPUTED_CACHE]: ComputedRef<boolean>
  private readonly [CONTEXT_CACHE_SIZE]: ComputedRef<
    Pick<Rect, "width" | "height">
  >

  private readonly [EMITTER] = mitt<{
    resize: Event
  }>()

  private readonly [SCOPE] = new EffectScope(true) as unknown as {
    active: boolean
    on: () => void
    off: () => void
    stop: () => void
  }

  private [WAIT_DRAWING] = false
  private [ID_REQUEST_FRAME]: number | null = null

  constructor(attrs: PersonalAttrs = {}) {
    super()
    this[SCOPE].on()

    this.attrs = reactive(attrs)

    const { canvas } = this[CONTEXT_CACHE]
    canvas.style.cssText = "position: absolute; margin: 0; padding: 0"
    watchEffect(() => {
      canvas.style.left = (this.attrs.x ?? 0) + "px"
      canvas.style.top = (this.attrs.y ?? 0) + "px"
    })
    // eslint-disable-next-line functional/no-let
    let displayBp = ""
    watchEffect(() => {
      displayBp = canvas.style.display
      const display = getComputedStyle(canvas).getPropertyValue("display")

      if (this.attrs.visible !== false) {
        if (display === "none") canvas.style.display = "block"
        else canvas.style.display = displayBp === "none" ? "" : displayBp

        return
      }

      if (display === "none") return

      canvas.style.display = "none"
    })

    this[COMPUTED_CACHE] = computed<boolean>(() => {
      const ctx = this[CONTEXT_CACHE]

      if (this.attrs.clearBeforeDraw !== false)
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
      this[DRAW_CONTEXT_ON_SANDBOX](ctx)

      return false
    })

    this[BOUNCE_CLIENT_RECT] = computed<Rect>(() => this.getClientRect())
    this[CONTEXT_CACHE_SIZE] = createContextCacheSize(this)

    // try watchEffect
    watchPostEffect(() => {
      // reactive
      const ctx = this[CONTEXT_CACHE]
      const { width, height } = this[CONTEXT_CACHE_SIZE].value
      ;[ctx.canvas.width, ctx.canvas.height] = [width, height]

      this[EMITTER].emit("resize", createEvent("resize", ctx.canvas))
      console.log(
        "[cache::layer]: size changed %sx%s",
        ctx.canvas.width,
        ctx.canvas.height
      )
    })

    this[SCOPE].off()
  }

  public get [CANVAS_ELEMENT]() {
    return this[CONTEXT_CACHE].canvas
  }

  private [DRAW_CONTEXT_ON_SANDBOX](context: CanvasRenderingContext2D) {
    drawLayer(context, this.attrs, this[CHILD_NODE], this)
  }

  public draw() {
    if (this.attrs.visible === false) return

    // eslint-disable-next-line no-unused-expressions
    this[COMPUTED_CACHE].value
  }

  public batchDraw() {
    if (!this[WAIT_DRAWING]) {
      this[WAIT_DRAWING] = true
      this[ID_REQUEST_FRAME] = requestAnimationFrame(() => {
        this.draw()
        this[WAIT_DRAWING] = false
        this.batchDraw()
      })
    }
  }

  public stopDraw() {
    if (!this[ID_REQUEST_FRAME]) return

    this[WAIT_DRAWING] = true
    cancelAnimationFrame(this[ID_REQUEST_FRAME])
    this[WAIT_DRAWING] = false
  }

  public destroy(): void {
    this.stopDraw()
    this[SCOPE].stop()
    this[CONTEXT_CACHE].canvas.remove()
  }
}
