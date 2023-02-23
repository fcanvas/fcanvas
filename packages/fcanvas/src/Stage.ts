import type { ComputedRef, UnwrapNestedRefs } from "@vue/reactivity"
import { computed, reactive } from "@vue/reactivity"

import type { Layer } from "./Layer"
import type { APIGroup } from "./apis/APIGroup"
import { APIChildNode } from "./apis/APIGroup"
import { effectScopeFlat } from "./apis/effectScopeFlat"
import { isDOM } from "./configs"
import { isDev } from "./env"
import { watchEffect } from "./fns/watch"
import { globalConfigs } from "./globalConfigs"
import { createTransform } from "./helpers/createTransform"
import type { DrawLayerAttrs } from "./helpers/drawLayer"
import { handleCustomEventDefault, hookEvent } from "./hookEvent"
import { isCanvasDOM } from "./logic/isCanvasDOM"
import {
  BOUNDING_CLIENT_RECT,
  CANVAS_ELEMENT,
  CHILD_NODE,
  DIV_CONTAINER,
  LISTENERS,
  SCOPE
} from "./symbols"
import type { CommonShapeEvents } from "./type/CommonShapeEvents"
import type { Rect } from "./type/Rect"
import type { Size } from "./type/Size"
import type { ReactiveType } from "./type/fn/ReactiveType"

type PersonalAttrs = DrawLayerAttrs & {
  width?: number
  height?: number
  container?: string | HTMLElement
  visible?: boolean
  opacity?: number
  autoDraw?: boolean
  offscreen?: boolean
}

type AllListeners = Map<
  string,
  /**
   * so Set because in Layer exists children for Set item. in children LISTENERS is Map<name, Set<func>>
   */ Map<
    // eslint-disable-next-line no-use-before-define
    Layer | Stage,
    // eslint-disable-next-line no-use-before-define, @typescript-eslint/no-explicit-any
    Map<Stage | APIGroup<any, any>, Array<(event: Event) => void>>
  >
>
function getListenersOnDeep(
  stage: Stage,
  allListeners: AllListeners,
  isStage: true
): AllListeners
// eslint-disable-next-line no-redeclare
function getListenersOnDeep(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  stage: APIGroup<any, any>,
  allListeners: AllListeners,
  isStage: false,
  layer: Layer
): AllListeners
// eslint-disable-next-line no-redeclare
function getListenersOnDeep(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  stage: Stage | APIGroup<any, any>,
  allListeners: AllListeners = new Map(),
  isStage: boolean,
  layer?: Layer
) {
  const key = (isStage ? stage : layer) as Stage | Layer
  stage[LISTENERS]?.forEach((listeners, name) => {
    // eslint-disable-next-line functional/no-let
    let map = allListeners.get(name as string)
    if (!map) allListeners.set(name as string, (map = new Map()))
    // eslint-disable-next-line functional/no-let
    let set = map.get(key)
    if (!set) map.set(key, (set = new Map()))
    set.set(stage, listeners)
  })
  stage[CHILD_NODE]?.forEach((layer) => {
    getListenersOnDeep(layer, allListeners, false, isStage ? layer : undefined)
  })

  return allListeners
}
export class Stage extends APIChildNode<Layer, CommonShapeEvents> {
  static readonly type: string = "Stage"

  public readonly $: UnwrapNestedRefs<PersonalAttrs>
  public get attrs(): UnwrapNestedRefs<PersonalAttrs> {
    return this.$
  }

  public readonly size: UnwrapNestedRefs<Size>
  public readonly [BOUNDING_CLIENT_RECT]: ComputedRef<Rect>

  private readonly [DIV_CONTAINER]?: HTMLDivElement

  private readonly [SCOPE] = effectScopeFlat()

  constructor(attrs: ReactiveType<PersonalAttrs> = {}) {
    super()

    this[DIV_CONTAINER] =
      isDOM && attrs.offscreen !== true
        ? document.createElement("div")
        : undefined

    this[SCOPE].fOn()

    this.$ = reactive(attrs)

    this.size = reactive({
      width: globalConfigs.defaultWidth,
      height: globalConfigs.defaultHeight
    })
    watchEffect(() => {
      this.size.width = this.$.width ?? globalConfigs.defaultWidth
      this.size.height = this.$.height ?? globalConfigs.defaultHeight
    })

    this[BOUNDING_CLIENT_RECT] = computed(() => {
      const { x = 0, y = 0 } = this.$
      const { width, height } = this.size

      return {
        x,
        y,
        width,
        height
      }
    })

    const container = this[DIV_CONTAINER]
    if (container /** @equal isDOM */) {
      container.style.cssText = "position: relative;"
      watchEffect(() => {
        const transform = createTransform(this.$)
        if (transform) container.style.transform = transform.toString()
      })
      watchEffect(() => {
        const { width, height } = this.size
        container.style.width = `${width}px`
        container.style.height = `${height}px`
      })

      // eslint-disable-next-line functional/no-let
      let displayBp = ""
      watchEffect(() => {
        displayBp = container.style.display
        const display = getComputedStyle(container).getPropertyValue("display")

        if (this.$.visible !== false) {
          if (display === "none") container.style.display = "block"
          else container.style.display = displayBp === "none" ? "" : displayBp

          return
        }

        if (display === "none") return

        container.style.display = "none"
      })
      watchEffect(() => {
        container.style.opacity = (this.$.opacity ?? 1) + ""
      })
    }

    // set max size for children
    watchEffect(() => {
      const { width, height } = this.size
      this[CHILD_NODE].forEach((node) => {
        const { width: oWidth, height: oHeight } = node[CANVAS_ELEMENT]

        if (oWidth !== width) node[CANVAS_ELEMENT].width = width
        if (oHeight !== height) node[CANVAS_ELEMENT].height = height
      })
    })

    watchEffect(() => {
      const { container: id, offscreen } = this.$
      if (offscreen) {
        return (
          __DEV__ && console.warn("[fcanvas/Stage]: disabled by 'offscreen'")
        )
      }

      if (id) {
        if (!container) {
          return (
            __DEV__ &&
            console.warn(
              "[fcanvas/Stage]: Can't handle options 'container' in a DOM-free environment"
            )
          )
        }

        const el =
          typeof id === "string"
            ? document.getElementById(id) ?? document.querySelector(id)
            : id
        if (!el) {
          if (__DEV__) console.warn(`#${id} not exists.`)
        } else {
          el.appendChild(container)
        }
      }
    })

    {
      // sync event on child node
      const handlersChildrenMap = new Map<
        keyof CommonShapeEvents,
        {
          name: string[]
          // eslint-disable-next-line func-call-spacing
          handle: (event: Event) => void
        }
      >()
      // scan all events in children
      const all = new Map()
      const allListeners = computed(() => {
        all.clear()
        return getListenersOnDeep(this, all, true)
      })
      watchEffect(() => {
        if (isDev) console.log("[event::layer]: scan deep listeners")

        const all = allListeners.value
        // remove handler remove
        handlersChildrenMap.forEach((customer, name) => {
          if (!all.has(name)) {
            customer.name.forEach((name) =>
              this._removeEvent(name, customer.handle)
            )
            handlersChildrenMap.delete(name)
          }
        })

        all.forEach((listenersGroup, name) => {
          const oldHandler = handlersChildrenMap.get(
            name as keyof CommonShapeEvents
          )

          if (oldHandler) return

          // custom
          const customer = hookEvent.get(name) ?? {
            name: [name],
            handle: handleCustomEventDefault
          }

          const handle = (event: Event) => {
            if (isDev) console.log("[event:layer] emit event %s", event.type)
            customer.handle(listenersGroup, event, this)
            // ================================================
          }
          handlersChildrenMap.set(name as keyof CommonShapeEvents, {
            name: customer.name,
            handle
          })
          customer.name.forEach((name) => this._addEvent(name, handle))
        })
      })
    }

    this[SCOPE].fOff()
  }

  public mount(query: string | HTMLElement): this {
    this.$.container = query
    return this
  }

  private __storeEvents = new Map<string, Array<(event: Event) => void>>()
  // eslint-disable-next-line func-call-spacing
  public __storeHandle = new Map<string, (event: Event) => void>()
  private _addEvent(name: string, cb: (event: Event) => void): void {
    // eslint-disable-next-line functional/no-let
    let cbs = this.__storeEvents.get(name)
    if (!cbs) {
      this.__storeEvents.set(name, (cbs = []))

      const handle = (event: Event) => {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        cbs!.forEach((cb) => cb(event))
      }
      this.__storeHandle.set(name, handle)
      this[DIV_CONTAINER]?.addEventListener(name, handle)
    }

    cbs.push(cb)
  }

  private _removeEvent(name: string, cb: (event: Event) => void): void {
    const cbs = this.__storeEvents.get(name)

    if (!cbs) return

    cbs.splice(cbs.indexOf(cb) >>> 0, 1)
    if (cbs.length === 0) {
      const cb = this.__storeHandle.get(name)
      if (cb) this[DIV_CONTAINER]?.removeEventListener(name, cb)
      this.__storeEvents.delete(name)
      this.__storeHandle.delete(name)
    }
  }

  public getBoundingClientRect() {
    return this[BOUNDING_CLIENT_RECT].value
  }

  public add(node: Layer) {
    const results = super.add(node)
    const { width, height } = this.size

    if (isCanvasDOM(node[CANVAS_ELEMENT]))
      this[DIV_CONTAINER]?.appendChild(node[CANVAS_ELEMENT])
    // fix https://github.com/tachibana-shin/fcanvas-next/issues/5
    const { width: oWidth, height: oHeight } = node[CANVAS_ELEMENT]

    if (oWidth !== width) node[CANVAS_ELEMENT].width = width

    if (oHeight !== height) node[CANVAS_ELEMENT].height = height
    if (this.$.autoDraw !== false && node.$.autoDraw !== false) node.batchDraw()

    return results
  }

  public destroy(): void {
    super.destroy()
    this[SCOPE].stop()
    this[DIV_CONTAINER]?.remove()
  }
}
