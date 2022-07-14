import { watchEffect } from "@vue-reactivity/watch"
import { EffectScope, reactive } from "@vue/reactivity"

import type { Layer } from "./Layer"
import { APIChildNode } from "./apis/APIGroup"
import { isDev } from "./env"
import { createTransform } from "./helpers/createTransform"
import type { DrawLayerAttrs } from "./helpers/drawLayer"
import {
  CANVAS_ELEMENT,
  CHILD_NODE,
  DIV_CONTAINER,
  LISTENERS,
  SCOPE
} from "./symbols"
import type { Rect } from "./type/Rect"
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
  // eslint-disable-next-line no-undef
  Pick<GlobalEventHandlersEventMap, keyof GlobalEventHandlersEventMap>
> {
  static readonly type: string = "Stage"

  public readonly $: ReturnType<typeof reactive<PersonalAttrs>>
  public get attrs() {
    return this.$
  }

  public readonly size: ReturnType<
    typeof reactive<Pick<Rect, "width" | "height">>
  > = reactive({ width: 300, height: 300 })

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
      this.size.width = this.$.width ?? 300
      this.size.height = this.$.height ?? 300
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
        node[CANVAS_ELEMENT].width = width
        node[CANVAS_ELEMENT].height = height
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

  // eslint-disable-next-line functional/functional-parameters
  public add(...nodes: Layer[]): void {
    super.add(...nodes)
    nodes.forEach((node) => {
      this[DIV_CONTAINER].appendChild(node[CANVAS_ELEMENT])
      if (this.$.autoDraw !== false) node.batchDraw()
    })
  }

  public destroy(): void {
    this[SCOPE].stop()
    this[DIV_CONTAINER].remove()
  }
}
