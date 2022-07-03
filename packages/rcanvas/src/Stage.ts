import { EffectScope, reactive } from "@vue/reactivity"
import { watchEffect } from "vue"

import type { Layer } from "./Layer"
import { APIChildNode } from "./apis/APIGroup"
import { createTransform } from "./helpers/createTransform"
import type { DrawLayerAttrs } from "./helpers/drawLayer"
import { CANVAS_ELEMENT, DIV_CONTAINER, LISTENERS, SCOPE } from "./symbols"

type PersonalAttrs = DrawLayerAttrs & {
  width?: number
  height?: number
  container: string
  visible?: boolean
  opacity?: number
}

export class Stage extends APIChildNode<
  Layer,
  // eslint-disable-next-line no-undef
  Pick<GlobalEventHandlersEventMap, keyof GlobalEventHandlersEventMap>
> {
  static readonly type: string = "Stage"

  public readonly attrs: ReturnType<typeof reactive<PersonalAttrs>>

  private readonly [DIV_CONTAINER] = document.createElement("div")

  private readonly [SCOPE] = new EffectScope(true) as unknown as {
    active: boolean
    on: () => void
    off: () => void
    stop: () => void
  }

  constructor(attrs: PersonalAttrs) {
    super()

    this[SCOPE].on()

    this.attrs = reactive(attrs)

    const container = this[DIV_CONTAINER]
    container.style.cssText = "position: relative;"
    watchEffect(() => {
      container.style.transform = createTransform(this.attrs).toString()
    })
    watchEffect(() => {
      container.style.width = `${this.attrs.width ?? 300}px`
      container.style.height = `${this.attrs.height ?? 300}px`
    })
    // eslint-disable-next-line functional/no-let
    let displayBp = ""
    watchEffect(() => {
      displayBp = container.style.display
      const display = getComputedStyle(container).getPropertyValue("display")

      if (this.attrs.visible !== false) {
        if (display === "none") container.style.display = "block"
        else container.style.display = displayBp === "none" ? "" : displayBp

        return
      }

      if (display === "none") return

      container.style.display = "none"
    })
    watchEffect(() => {
      container.style.opacity = (this.attrs.opacity ?? 1) + ""
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

    this[SCOPE].off()

    const el = document.getElementById(attrs.container)
    if (!el) console.warn(`#${attrs.container} not exists.`)
    else el.appendChild(container)
  }

  // eslint-disable-next-line functional/functional-parameters
  public add(...nodes: Layer[]): void {
    super.add(...nodes)
    nodes.forEach((node) => {
      this[DIV_CONTAINER].appendChild(node[CANVAS_ELEMENT])
      node.batchDraw()
    })
  }

  public destroy(): void {
    this[SCOPE].stop()
    this[DIV_CONTAINER].remove()
  }
}
