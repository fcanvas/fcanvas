import type {
  ComputedRef,
  ShallowReactive,
  UnwrapNestedRefs
} from "@vue/reactivity"
import { computed, reactive, shallowReactive } from "@vue/reactivity"

import type { Layer } from "./Layer"
import { APIChildNode } from "./apis/APIGroup"
import { effectScopeFlat } from "./apis/effectScopeFlat"
import { isDOM } from "./configs"
import { watchEffect } from "./fns/watch"
import { globalConfigs } from "./globalConfigs"
import { createTransform } from "./helpers/createTransform"
import type { DrawLayerAttrs } from "./helpers/drawLayer"
import { handleCustomEventDefault, hookEvent } from "./hookEvent"
import type { MapListeners } from "./logic/getListenersAll"
import { getListenersAll } from "./logic/getListenersAll"
import { isCanvasDOM } from "./logic/isCanvasDOM"
import {
  ADD_EVENT,
  BOUNDING_CLIENT_RECT,
  CANVAS_ELEMENT,
  CHILD_NODE,
  DIV_CONTAINER,
  RAW_MAP_LISTENERS,
  REMOVE_EVENT,
  SCOPE,
  STORE_EVENTS
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

export class Stage extends APIChildNode<Layer, CommonShapeEvents> {
  static readonly type: string = "Stage"

  public readonly $: UnwrapNestedRefs<PersonalAttrs>
  public get attrs(): UnwrapNestedRefs<PersonalAttrs> {
    return this.$
  }

  public readonly size: UnwrapNestedRefs<Size>
  public readonly [BOUNDING_CLIENT_RECT]: ComputedRef<Rect>
  public readonly [RAW_MAP_LISTENERS]: MapListeners

  public readonly [STORE_EVENTS]: ShallowReactive<
    Map<
      string,
      {
        deps: Set<string>
        cbs: Array<(event: Event) => void>
        handle: (event: Event) => void
      }
    >
  >

  private readonly [DIV_CONTAINER]?: HTMLDivElement

  private readonly [SCOPE] = effectScopeFlat()

  constructor(attrs: ReactiveType<PersonalAttrs> = {}) {
    super()

    this[DIV_CONTAINER] =
      isDOM && attrs.offscreen !== true
        ? document.createElement("div")
        : undefined
    this[STORE_EVENTS] = shallowReactive(new Map())

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
      this[RAW_MAP_LISTENERS] = all
      const allListeners = computed(() => {
        all.clear()
        return getListenersAll(this, all, true)
      })
      watchEffect(() => {
        if (__DEV_LIB__) console.log("[event::layer]: scan deep listeners")

        const all = allListeners.value // is equal const all = new Map()
        // remove handler remove
        handlersChildrenMap.forEach((customer, name) => {
          if (!all.has(name)) {
            customer.name.forEach((name) =>
              this[REMOVE_EVENT](name, customer.handle)
            )
            handlersChildrenMap.delete(name)
          }
        })

        all.forEach((_, name) => {
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
            if (__DEV_LIB__)
              console.log("[event:layer] emit event %s", event.type)
            customer.handle(all, name, event, this)
            // ================================================
          }
          handlersChildrenMap.set(name as keyof CommonShapeEvents, {
            name: customer.name,
            handle
          })
          customer.name.forEach((name) => this[ADD_EVENT](name, handle, name))
        })
      })
    }

    this[SCOPE].fOff()
  }

  public mount(query: string | HTMLElement): this {
    this.$.container = query
    return this
  }

  public [ADD_EVENT](name: string, cb: (event: Event) => void): void
  public [ADD_EVENT](
    name: string,
    cb: (event: Event) => void,
    nameEvent: string
  ): void
  public [ADD_EVENT](
    name: string,
    cb: (event: Event) => void,
    nameEvent?: string
  ): void {
    // eslint-disable-next-line functional/no-let
    let conf = this[STORE_EVENTS].get(name)
    if (!conf) {
      const handle = (event: Event) => {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        conf!.cbs.forEach((cb) => cb(event))
      }
      this[STORE_EVENTS].set(
        name,
        (conf = { deps: new Set(), cbs: [], handle })
      )
      this[DIV_CONTAINER]?.addEventListener(name, handle)
    }

    conf.cbs.push(cb)
    if (nameEvent) conf.deps.add(nameEvent)
  }

  public [REMOVE_EVENT](name: string, cb: (event: Event) => void): void {
    const conf = this[STORE_EVENTS].get(name)

    if (!conf) return

    conf.cbs.splice(conf.cbs.indexOf(cb) >>> 0, 1)
    if (conf.cbs.length === 0) {
      this[DIV_CONTAINER]?.removeEventListener(name, conf.handle)
      this[STORE_EVENTS].delete(name)
    } else {
      conf.deps.delete(name)
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
