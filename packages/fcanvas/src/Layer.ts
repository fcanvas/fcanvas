import type {
  ComputedRef,
  ShallowReactive,
  UnwrapNestedRefs
} from "@vue/reactivity"
import { computed, reactive } from "@vue/reactivity"
import { watchEffect } from "src/fns/watch"

import type { Group } from "./Group"
import type { Shape } from "./Shape"
import { APIGroup } from "./apis/APIGroup"
import { effectScopeFlat } from "./apis/effectScopeFlat"
import { CONFIGS } from "./configs"
import { isDev } from "./env"
import type { DrawLayerAttrs } from "./helpers/drawLayer"
import { drawLayer } from "./helpers/drawLayer"
import { handleCustomEventDefault, hookEvent } from "./hookEvent"
import {
  BOUNCE_CLIENT_RECT,
  BOUNDING_CLIENT_RECT,
  CANVAS_ELEMENT,
  CHILD_NODE,
  COMPUTED_CACHE,
  CONTEXT_CACHE,
  DRAW_CONTEXT_ON_SANDBOX,
  LISTENERS,
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
    width?: number
    height?: number
    visible?: boolean
  }

const WAIT_DRAWING = Symbol("wait drawing")
const ID_REQUEST_FRAME = Symbol("ID_REQUEST_FRAME")

// eslint-disable-next-line @typescript-eslint/no-explicit-any
interface LikeGroupAndPressPoint extends APIGroup<any, Record<string, string>> {
  isPressedPoint?: (x: number, y: number) => boolean
}
function getListenersOnDeep(
  layer: LikeGroupAndPressPoint,
  allListeners = new Map<
    string,
    Map<LikeGroupAndPressPoint, Set<(event: Event) => void>>
  >()
) {
  layer[LISTENERS]?.forEach((listeners, name) => {
    if (!allListeners.has(name)) allListeners.set(name, new Map())

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    allListeners.get(name)!.set(layer, listeners)
  })
  layer[CHILD_NODE]?.forEach((shape) => {
    getListenersOnDeep(shape, allListeners)
  })

  return allListeners
}

export class Layer extends APIGroup<Shape | Group, CommonShapeEvents> {
  static readonly type: string = "Layer"

  public readonly $: UnwrapNestedRefs<PersonalAttrs>
  public get attrs() {
    return this.$
  }

  public readonly [BOUNCE_CLIENT_RECT]: ComputedRef<Rect>
  public readonly [BOUNDING_CLIENT_RECT]: ComputedRef<Rect>

  private readonly [CONTEXT_CACHE] = CONFIGS.createContext2D()

  private readonly [COMPUTED_CACHE]: ComputedRef<boolean>

  private readonly [SCOPE] = effectScopeFlat()

  private [WAIT_DRAWING] = false
  private [ID_REQUEST_FRAME]: number | null = null

  constructor(attrs: ReactiveType<PersonalAttrs> = {}) {
    super()
    this[SCOPE].fOn()

    this.$ = reactive(attrs)

    const { canvas } = this[CONTEXT_CACHE]
    const isNode = !canvas.style
    if (!isNode)
      canvas.style.cssText = "position: absolute; margin: 0; padding: 0"
    watchEffect(() => {
      if (isNode) return
      canvas.style.left = (this.$.x ?? 0) + "px"
      canvas.style.top = (this.$.y ?? 0) + "px"
    })
    // eslint-disable-next-line functional/no-let
    let displayBp = ""
    watchEffect(() => {
      if (isNode) return

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
    this[COMPUTED_CACHE] = computed<boolean>(() => {
      const ctx = this[CONTEXT_CACHE]

      if (this.$.clearBeforeDraw !== false)
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
      this[DRAW_CONTEXT_ON_SANDBOX](ctx)

      return false
    })

    // try watchEffect
    watchEffect(() => {
      const { width, height } = this.$
      const useConfig = width !== undefined && height !== undefined

      if (!useConfig) return

      // reactive
      const ctx = this[CONTEXT_CACHE]
      ;[ctx.canvas.width, ctx.canvas.height] = [width, height]

      this.emit("resize", extendTarget(new UIEvent("resize"), ctx.canvas))
      if (isDev) {
        console.log(
          "[cache::layer]: size changed %sx%s",
          ctx.canvas.width,
          ctx.canvas.height
        )
      }
    })

    // event binding
    {
      // sync event on layer
      const handlersMap = new Map<
        // eslint-disable-next-line func-call-spacing
        keyof CommonShapeEvents,
        (event: Event) => void
      >()
      watchEffect(() => {
        handlersMap.forEach((handler, name) => {
          if (!this[LISTENERS].has(name))
            canvas.removeEventListener(name, handler)
        })
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
      // scan all events in children
      const allListeners = computed(() => getListenersOnDeep(this))
      watchEffect(() => {
        if (isDev) console.log("[event::layer]: scan deep listeners")
        // remove handler remove
        handlersChildrenMap.forEach((customer, name) => {
          if (!allListeners.value.has(name)) {
            customer.name.forEach((name) =>
              canvas.removeEventListener(name, customer.handle)
            )
          }
        })

        allListeners.value.forEach((listenersGroup, name) => {
          const oldHandler = handlersChildrenMap.get(
            name as keyof CommonShapeEvents
          )

          if (oldHandler) {
            oldHandler.name.forEach((name) =>
              canvas.removeEventListener(name, handle)
            )
          }

          // custom
          const customer = hookEvent.get(name) || {
            name: [name],
            handle: handleCustomEventDefault
          }

          const handle = (event: Event) => {
            if (isDev) console.log("[event:layer] emit event %s", event.type)
            customer.handle(listenersGroup, event, canvas)
            // ================================================
          }
          handlersChildrenMap.set(name as keyof CommonShapeEvents, {
            name: customer.name,
            handle
          })
          customer.name.forEach((name) => canvas.addEventListener(name, handle))
        })
      })
    }

    this[SCOPE].fOff()
  }

  public get [CANVAS_ELEMENT]() {
    return this[CONTEXT_CACHE].canvas
  }

  private [DRAW_CONTEXT_ON_SANDBOX](context: CanvasRenderingContext2D) {
    drawLayer(context, this.$, this[CHILD_NODE], this)
  }

  public getBoundingClientRect() {
    return this[BOUNDING_CLIENT_RECT].value
  }

  public draw() {
    if (this.$.visible === false) return

    // eslint-disable-next-line no-unused-expressions
    this[COMPUTED_CACHE].value
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

  public batchDraw() {
    if (!this[WAIT_DRAWING]) {
      this[WAIT_DRAWING] = true
      this[ID_REQUEST_FRAME] = requestAnimationFrame(() => {
        if (!this[WAIT_DRAWING]) return

        this.draw()
        this[WAIT_DRAWING] = false
        this._resolveTick?.()
        this.batchDraw()
      })
    }
  }

  public stopDraw() {
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

  public destroy(): void {
    super.destroy()
    this.stopDraw()
    this[SCOPE].stop()
    this[CONTEXT_CACHE].canvas.remove()
  }
}
