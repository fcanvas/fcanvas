import { watchEffect } from "@vue-reactivity/watch"
import type { ComputedRef } from "@vue/reactivity"
import { computed, EffectScope, reactive } from "@vue/reactivity"

import type { Group } from "./Group"
import type { Shape } from "./Shape"
import { APIGroup } from "./apis/APIGroup"
import type { DrawLayerAttrs } from "./helpers/drawLayer"
import { drawLayer } from "./helpers/drawLayer"
import { handleCustomEventDefault, hookEvent } from "./hookEvent"
import {
  BOUNCE_CLIENT_RECT,
  CANVAS_ELEMENT,
  CHILD_NODE,
  COMPUTED_CACHE,
  CONTEXT_CACHE,
  DRAW_CONTEXT_ON_SANDBOX,
  LISTENERS,
  LISTENERS_ROOT,
  SCOPE
} from "./symbols"
import type { CommonShapeEvents } from "./type/CommonShapeEvents"
import type { Offset } from "./type/Offset"
import type { Rect } from "./type/Rect"
import type { ReactiveType } from "./type/fn/ReactiveType"
import { _setClientActivated } from "./useApi/useClientActivated"
import { _setEvent } from "./useApi/useEvent"
import { extendTarget } from "./utils/extendTarget"

type PersonalAttrs = Partial<Offset> &
  DrawLayerAttrs & {
    clearBeforeDraw?: boolean
    width?: number
    height?: number
    visible?: boolean
  }

const WAIT_DRAWING = Symbol("wait drawing")
const ID_REQUEST_FRAME = Symbol("ID_REQUEST_FRAME")
/**
 * @protected
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AllLayer = APIGroup<any, Record<string, string>> & {
  isPressedPoint?: (x: number, y: number) => boolean
}
function getListenersOnDeep(
  layer: AllLayer,
  allListeners = new Map<
    string,
    {
      all: Map<AllLayer, Set<(event: Event) => void>>
      root: boolean
    }
  >()
) {
  layer[LISTENERS]?.forEach((listeners, name) => {
    if (!allListeners.has(name)) {
      allListeners.set(name, {
        all: new Map(),
        root: false
      })
    }

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    allListeners.get(name)!.all.set(layer, listeners)
  })
  layer[LISTENERS_ROOT]?.forEach((listeners, name) => {
    if (!allListeners.has(name)) {
      allListeners.set(name, {
        all: new Map(),
        root: true
      })
    }

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    allListeners.get(name)!.all.set(layer, listeners)
  })
  layer[CHILD_NODE]?.forEach((shape) => {
    getListenersOnDeep(shape, allListeners)
  })

  return allListeners
}

export class Layer extends APIGroup<Shape | Group, CommonShapeEvents> {
  static readonly type: string = "Layer"

  public readonly attrs: ReturnType<typeof reactive<PersonalAttrs>>

  public readonly [BOUNCE_CLIENT_RECT]: ComputedRef<Rect>

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  private readonly [CONTEXT_CACHE] = document
    .createElement("canvas")
    .getContext("2d")!

  private readonly [COMPUTED_CACHE]: ComputedRef<boolean>

  private readonly [SCOPE] = new EffectScope(true) as unknown as {
    active: boolean
    on: () => void
    off: () => void
    stop: () => void
  }

  private [WAIT_DRAWING] = false
  private [ID_REQUEST_FRAME]: number | null = null

  constructor(attrs: ReactiveType<PersonalAttrs> = {}) {
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

    // try watchEffect
    watchEffect(
      () => {
        const { width, height } = this.attrs
        const useConfig = width !== undefined && height !== undefined

        if (!useConfig) return

        // reactive
        const ctx = this[CONTEXT_CACHE]
        ;[ctx.canvas.width, ctx.canvas.height] = [width, height]

        this.emit("resize", extendTarget(new UIEvent("resize"), ctx.canvas))
        console.log(
          "[cache::layer]: size changed %sx%s",
          ctx.canvas.width,
          ctx.canvas.height
        )
      },
      {
        flush: "post"
      }
    )

    // event binding
    {
      // sync event on layer
      const handlersMap = new Map<
        // eslint-disable-next-line func-call-spacing
        keyof CommonShapeEvents,
        (event: Event) => void
      >()
      watchEffect(() => {
        this[LISTENERS].forEach((listeners, name) => {
          // if exists on handlersMap => first removeEventListener
          const oldHandler = handlersMap.get(name)
          if (oldHandler) canvas.removeEventListener(name, oldHandler)

          const handler = (event: Event) => {
            listeners.forEach((listener) => listener(event))
          }
          handlersMap.set(name, handler)
          canvas.addEventListener(name, handler)
        })
        handlersMap.forEach((handler, name) => {
          if (!this[LISTENERS].has(name))
            canvas.removeEventListener(name, handler)
        })
      })
    }
    // sync event on child node
    {
      const handlersChildrenMap = new Map<
        keyof CommonShapeEvents,
        {
          name: string[]
          // eslint-disable-next-line func-call-spacing
          handle: (event: Event) => void
        }
      >()
      watchEffect(() => {
        console.log("[event::layer]: scan deep listeners")
        // scan all events in children
        const allListeners = getListenersOnDeep(this)
        allListeners.forEach((listenersGroup, name) => {
          const oldHandler = handlersChildrenMap.get(
            name as keyof CommonShapeEvents
          )

          // custom
          const customer = hookEvent.get(name) || {
            name: [name],
            handle: handleCustomEventDefault
          }

          if (oldHandler) {
            oldHandler.name.forEach((name) =>
              canvas.removeEventListener(name, oldHandler.handle)
            )
          }

          const handle = listenersGroup.root
            ? (event: Event) => {
                console.log("[event::root:layer] emit event %s", event.type)
                listenersGroup.all.forEach((listeners) => {
                  listeners.forEach((listener) => listener(event))
                })
              }
            : (event: Event) => {
                // ================== set use api =================
                _setEvent(event)
                // ================================================

                console.log("[event:layer] emit event %s", event.type)
                customer.handle(listenersGroup.all, event, canvas)
                // =================== free memory ================
                _setEvent(null)
                _setClientActivated(null)
                // ================================================
              }
          handlersChildrenMap.set(name as keyof CommonShapeEvents, {
            name: customer.name,
            handle
          })
          customer.name.forEach((name) => canvas.addEventListener(name, handle))
        })
        handlersChildrenMap.forEach((customer, name) => {
          if (!allListeners.has(name)) {
            customer.name.forEach((name) =>
              canvas.removeEventListener(name, customer.handle)
            )
          }
        })
      })
    }

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
