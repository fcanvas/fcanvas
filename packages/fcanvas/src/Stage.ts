import type { AttrsSelf, EventsSelf } from "./Container"
import { Container } from "./Container"
import type { Layer } from "./Layer"
import { Utils } from "./Utils"
import { globalConfigs } from "./global-configs"
import type { OptionTransform } from "./helpers/createTransform"
import { createTransform } from "./helpers/createTransform"
import type Props from "./types/Props"

type Attrs = {
  width: number

  height: number

  container: string

  visible?: boolean

  opacity?: number
} & OptionTransform

// eslint-disable-next-line no-undef
type EventsCustom = HTMLElementEventMap

export class Stage<
  AttrsRefs extends Props = Props,
  AttrsRaws extends Props = Props
> extends Container<Attrs, EventsCustom, Layer, AttrsRefs, AttrsRaws> {
  static readonly type: string = "Stage"
  readonly #container = Utils.createDiv()

  constructor(attrs: AttrsSelf<Attrs, AttrsRefs, AttrsRaws>) {
    super(attrs)

    const el = Utils.document.getElementById(attrs.container)
    if (!el) {
      // eslint-disable-next-line functional/no-throw-statement
      throw new Error(`#${attrs.container} not exists.`)
    }

    this.#container.style.cssText = "position: relative;"

    this.watch(
      ["scale", "rotation", "offset", "skewX", "skewY"],
      () => {
        this.#container.style.transform = createTransform(this.attrs).toString()
      },
      {
        immediate: true,
        deep: true
      }
    )
    this.watch(
      ["width", "height"],
      () => {
        this.#container.style.width = `${this.attrs.width ?? 300}px`
        this.#container.style.height = `${this.attrs.height ?? 300}px`
      },
      {
        immediate: true
      }
    )
    // eslint-disable-next-line functional/no-let
    let displayBp = ""
    this.watch(
      "visible",
      () => {
        displayBp = this.#container.style.display
        const display = getComputedStyle(this.#container).getPropertyValue(
          "display"
        )

        if (this.attrs.visible !== false) {
          if (display === "none") {
            this.#container.style.display = "block"
          } else {
            this.#container.style.display =
              displayBp === "none" ? "" : displayBp
          }

          return
        }

        if (display === "none") return

        this.#container.style.display = "none"
      },
      {
        immediate: true
      }
    )
    this.watch(
      "id",
      () => {
        this.#container.setAttribute("id", this.attrs.id ?? "")
      },
      {
        immediate: true
      }
    )
    this.watch(
      "name",
      () => {
        this.#container.setAttribute("class", this.attrs.name ?? "")
      },
      {
        immediate: true
      }
    )
    this.watch(
      "opacity",
      (val) => {
        this.#container.style.opacity = val + ""
      },
      {
        immediate: true
      }
    )

    el.appendChild(this.#container)
  }

  // eslint-disable-next-line functional/functional-parameters
  add(...layers: Layer[]) {
    layers.forEach((layer) => {
      if (this.#container.contains(layer.canvas) === false)
        this.#container.appendChild(layer.canvas)
    })
    super.add(...layers)
    if (globalConfigs.autoDrawEnabled)
      layers.forEach((layer) => layer.batchDraw())
  }

  // eslint-disable-next-line functional/functional-parameters
  delete(...layers: Layer[]) {
    super.delete(...layers)
    layers.forEach((layer) => {
      layer.destroy()
    })
  }

  public on<Name extends keyof EventsSelf<EventsCustom>>(
    name: Name,
    callback: (this: this, event: EventsSelf<EventsCustom>[Name]) => void
  ): this
  public on(name: string, callback: (this: this, event: Event) => void): this
  public on(
    name: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    callback: (event: any) => void
  ): this {
    super.on(name, callback)

    if (this.listeners) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      this.#container.addEventListener(name, callback as unknown as any)
    }

    return this
  }

  public off<Name extends keyof EventsSelf<EventsCustom>>(
    name: Name,
    callback?: (this: this, event: EventsSelf<EventsCustom>[Name]) => void
  ): this
  public off(name: string, callback?: (this: this, event: Event) => void): this
  public off(
    name: string | keyof EventsSelf<EventsCustom>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    callback?: (event: any) => void
  ): this {
    if (callback) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      this.#container.removeEventListener(name, callback as unknown as any)
    } else {
      if (this.listeners) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        this.listeners
          .get(name)!
          .forEach((cb) => this.#container.removeEventListener(name, cb))
      }
    }

    super.off(name, callback)

    return this
  }

  public destroy(): void {
    this.listeners?.forEach((_cbs, name) => this.off(name))
    super.destroy()
    this.#container.remove()
  }
}
