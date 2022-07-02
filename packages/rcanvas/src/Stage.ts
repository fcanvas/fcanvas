import { EffectScope, reactive } from "@vue/reactivity"
import { watchEffect } from "vue"

import { APIChildNode } from "./APIGroup"
import type { Layer } from "./Layer"
import { createTransform } from "./helpers/createTransform"
import type { DrawLayerAttrs } from "./helpers/drawLayer"
import { DIV_CONTAINER, SCOPE } from "./symbols"

type PersonalAttrs = DrawLayerAttrs & {
  width: number
  height: number
  container: string
  visible?: boolean
  opacity?: number
}

// type EventsCustom = HTMLElementEventMap

export class Stage extends APIChildNode<Layer> {
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

    this[SCOPE].off()

    const el = document.getElementById(attrs.container)
    if (!el) console.warn(`#${attrs.container} not exists.`)
    else el.appendChild(container)
  }

  public destroy(): void {
    this[SCOPE].stop()
    this[DIV_CONTAINER].remove()
  }
}
