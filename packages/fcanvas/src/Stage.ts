import { watchEffect } from "@vue-reactivity/watch"
import type { UnwrapNestedRefs } from "@vue/reactivity"
import { EffectScope, reactive } from "@vue/reactivity"

import type { Layer } from "./Layer"
import { APIChildNode } from "./apis/APIGroup"
import { isDev } from "./env"
import { globalConfigs } from "./globalConfigs"
import { createTransform } from "./helpers/createTransform"
import type { DrawLayerAttrs } from "./helpers/drawLayer"
import {
  CANVAS_ELEMENT,
  CHILD_NODE,
  DIV_CONTAINER,
  LISTENERS,
  SCOPE
} from "./symbols"
import type { Size } from "./type/Size"
import type { ReactiveType } from "./type/fn/ReactiveType"

type PersonalAttrs = DrawLayerAttrs & {
  width?: number
  height?: number
  container?: string
  visible?: boolean
  opacity?: number
  autoDraw?: boolean
}

export class Stage extends APIChildNode<
  Layer,
  Pick<GlobalEventHandlersEventMap, keyof GlobalEventHandlersEventMap>
> {
  static readonly type: string = "Stage"

  public readonly $: ReturnType<typeof reactive<PersonalAttrs>>
  public get attrs() {
    return this.$
  }

  public readonly size: UnwrapNestedRefs<Size> = reactive({
    width: globalConfigs.defaultWidth,
    height: globalConfigs.defaultHeight
  })

  private readonly [DIV_CONTAINER] = document.createElement("div")

  private readonly [SCOPE] = new EffectScope(true) as unknown as {
    active: boolean
    on: () => void
    off: () => void
    stop: () => void
  }

  constructor(attrs: ReactiveType<PersonalAttrs> = {}) {
    super()

    this[SCOPE].on()

    this.$ = reactive(attrs as PersonalAttrs)
    watchEffect(() => {
      this.size.width = this.$.width ?? globalConfigs.defaultWidth
      this.size.height = this.$.height ?? globalConfigs.defaultHeight
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
      if (id !== undefined) {
        const el = document.getElementById(id)
        if (!el) {
          if (isDev) console.warn(`#${id} not exists.`)
        } else {
          el.appendChild(container)
        }
      }
    })

    this[SCOPE].off()
  }

  public add(node: Layer): void {
    super.add(node)
    const { width, height } = this.size

    this[DIV_CONTAINER].appendChild(node[CANVAS_ELEMENT])
    // fix https://github.com/tachibana-shin/fcanvas-next/issues/5
    const { width: oWidth, height: oHeight } = node[CANVAS_ELEMENT]

    if (oWidth !== width) node[CANVAS_ELEMENT].width = width

    if (oHeight !== height) node[CANVAS_ELEMENT].height = height
    if (this.$.autoDraw !== false) node.batchDraw()
  }

  public destroy(): void {
    this[SCOPE].stop()
    this[DIV_CONTAINER].remove()
  }
}
