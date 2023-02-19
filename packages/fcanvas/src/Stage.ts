import type { ComputedRef, UnwrapNestedRefs } from "@vue/reactivity"
import { computed, reactive } from "@vue/reactivity"
import { watchEffect } from "src/fns/watch"

import type { Layer } from "./Layer"
import { APIChildNode } from "./apis/APIGroup"
import { effectScopeFlat } from "./apis/effectScopeFlat"
import { isDev } from "./env"
import { globalConfigs } from "./globalConfigs"
import { createTransform } from "./helpers/createTransform"
import type { DrawLayerAttrs } from "./helpers/drawLayer"
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
}

export class Stage extends APIChildNode<Layer, CommonShapeEvents> {
  static readonly type: string = "Stage"

  public readonly $: UnwrapNestedRefs<PersonalAttrs>
  public get attrs(): UnwrapNestedRefs<PersonalAttrs> {
    return this.$
  }

  public readonly size: UnwrapNestedRefs<Size>
  public readonly [BOUNDING_CLIENT_RECT]: ComputedRef<Rect>

  private readonly [DIV_CONTAINER] = document.createElement("div")

  private readonly [SCOPE] = effectScopeFlat()

  constructor(attrs: ReactiveType<PersonalAttrs> = {}) {
    super()

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
    container.style.cssText = "position: relative;"
    watchEffect(() => {
      container.style.transform = createTransform(this.$).toString()
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
    // event binding
    // eslint-disable-next-line func-call-spacing
    const handlersMap = new Map<string, (event: Event) => void>()
    watchEffect(() => {
      this[LISTENERS].forEach((listeners, name) => {
        // if exists on handlersMap => first removeEventListener
        const oldHandler = handlersMap.get(name)
        if (oldHandler) container.removeEventListener(name, oldHandler)

        const handler = (event: Event) => {
          listeners.forEach((listener) => listener(event))
        }
        handlersMap.set(name, handler)
        container.addEventListener(name, handler)
      })
    })

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
      const { container: id } = this.$
      if (id) {
        const el =
          typeof id === "string"
            ? document.getElementById(id) ?? document.querySelector(id)
            : id
        if (!el) {
          if (isDev) console.warn(`#${id} not exists.`)
        } else {
          el.appendChild(container)
        }
      }
    })

    this[SCOPE].fOff()
  }

  public mount(query: string | HTMLElement): void {
    this.$.container = query
  }

  public getBoundingClientRect() {
    return this[BOUNDING_CLIENT_RECT].value
  }

  public add(node: Layer) {
    const results = super.add(node)
    const { width, height } = this.size

    this[DIV_CONTAINER].appendChild(node[CANVAS_ELEMENT])
    // fix https://github.com/tachibana-shin/fcanvas-next/issues/5
    const { width: oWidth, height: oHeight } = node[CANVAS_ELEMENT]

    if (oWidth !== width) node[CANVAS_ELEMENT].width = width

    if (oHeight !== height) node[CANVAS_ELEMENT].height = height
    if ((this.$.autoDraw ?? isDOM) !== false && node.$.autoDraw !== false)
      node.batchDraw()

    return results
  }

  public destroy(): void {
    super.destroy()
    this[SCOPE].stop()
    this[DIV_CONTAINER].remove()
  }
}
