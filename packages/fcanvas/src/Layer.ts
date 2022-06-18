import type { AttrsSelf, EventsSelf } from "./Container"
import { ContainerCanvas } from "./Container"
import type { Group } from "./Group"
import type { Stage } from "./Stage"
import { Utils } from "./Utils"
import type { AttrsDrawLayerContext } from "./helpers/drawLayerContextUseOpacityClipTransformFilter"
import { drawLayerContextUseOpacityClipTransformFilter } from "./helpers/drawLayerContextUseOpacityClipTransformFilter"
import type AllShape from "./types/AllShape"
import type { Offset } from "./types/Offset"

type Attrs = Partial<Offset> & {
  clearBeforeDraw?: boolean

  width?: number

  height?: number

  visible?: boolean

  filterItem?: <Node extends AllShape | Group>(
    node: Node,
    index: number
  ) => void | boolean
} & AttrsDrawLayerContext

const EventsDefault = [
  "mouseover",
  "mouseout",
  "mouseenter",
  "mouseleave",
  "mousemove",
  "mousedown",
  "wheel",
  "click",
  "dblclick",

  "touchstart",
  "touchmove",
  "touchend",
  "tap",
  "dbltap"
]

type EventsCustom = HTMLElementEventMap & {
  readonly "resize-self": void
}

export class Layer<
  AttrsRefs extends Record<string, unknown> = Record<string, unknown>,
  AttrsRaws extends Record<string, unknown> = Record<string, unknown>
> extends ContainerCanvas<
  Attrs,
  EventsCustom,
  AllShape | Group,
  AttrsRefs,
  AttrsRaws
> {
  static readonly raws = ["x", "y", "visible"]
  static readonly type: string = "Layer"

  public readonly parents = new Set<Stage>()

  public loopCasting = false
  public get canvas() {
    return this.#context.canvas
  }

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  readonly #context = Utils.createCanvas().getContext("2d")!

  private waitDrawing = false

  private displayBp = ""

  private idRequestFrame?: ReturnType<typeof requestAnimationFrame>

  private __watcherParentSize?: () => void

  constructor(attrs: AttrsSelf<Attrs, AttrsRefs, AttrsRaws> = {}) {
    super(
      attrs,
      () => {
        this.currentNeedReload = true
      },
      Layer.raws
    )

    this.#context.canvas.style.cssText =
      "position: absolute; margin: 0; padding: 0"

    const onResizeSelf = () => {
      if (this.attrs.width !== void 0) {
        this.#context.canvas.width = this.attrs.width
      } else {
        this.#context.canvas.style.width = "100%"
        this.#context.canvas.width = this.#context.canvas.scrollWidth
      }
      if (this.attrs.height !== void 0) {
        this.#context.canvas.height = this.attrs.height
      } else {
        this.#context.canvas.style.height = "100%"
        this.#context.canvas.height = this.#context.canvas.scrollHeight
      }
      this.currentNeedReload = true
    }
    void onResizeSelf()
    this.on("resize-self", onResizeSelf)

    this.watch(
      ["x", "y"],
      () => {
        this.#context.canvas.style.left = (this.attrs.x ?? 0) + "px"
        this.#context.canvas.style.top = (this.attrs.y ?? 0) + "px"
      },
      { immediate: true }
    )
    this.watch(["width", "height"], () => void this.emit("resize-self", void 0))
    this.watch(
      "visible",
      () => {
        this.displayBp = this.#context.canvas.style.display
        const display = getComputedStyle(this.#context.canvas).getPropertyValue(
          "display"
        )

        if (this.attrs.visible !== false) {
          if (display === "none") {
            this.#context.canvas.style.display = "block"
          } else {
            this.#context.canvas.style.display =
              this.displayBp === "none" ? "" : this.displayBp
          }

          return
        }

        if (display === "none") return

        this.#context.canvas.style.display = "none"
      },
      { immediate: true }
    )
    this.watch(
      "id",
      () => {
        this.#context.canvas.setAttribute("id", this.attrs.id ?? "")
      },
      { immediate: true }
    )
    this.watch(
      "name",
      () => {
        this.#context.canvas.setAttribute("class", this.attrs.name ?? "")
      },
      { immediate: true }
    )

    EventsDefault.forEach((type) => {
      this.on(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        type as any,
        this.fireChild.bind(this)
      )
    })
  }

  public _onAddToParent(parent: Stage) {
    this.__watcherParentSize = parent.watch(
      ["width", "height"],
      () => {
        this.emit("resize-self", void 0)
      },
      {
        immediate: true
      }
    )
    this.parents.add(parent)
  }

  public _onDeleteParent(parent: Stage) {
    this.__watcherParentSize?.() // cancel watcher
    this.parents.delete(parent)
  }

  public draw() {
    if (this.currentNeedReload === false || this.attrs.visible === false) return

    if (this.attrs.clearBeforeDraw !== false) {
      this.#context.clearRect(
        0,
        0,
        this.#context.canvas.width,
        this.#context.canvas.height
      )
    }
    drawLayerContextUseOpacityClipTransformFilter(
      this.#context,
      this.attrs,
      this.children,
      this.attrs.filterItem,
      this
    )

    this.currentNeedReload = false
  }

  // @overwrite
  // eslint-disable-next-line functional/functional-parameters
  public add(...nodes: (AllShape | Group)[]): void {
    super.add(...nodes)
    nodes.forEach((node) => node._onAddToParent(this))
  }

  // eslint-disable-next-line functional/functional-parameters
  public delete(...nodes: (AllShape | Group)[]): void {
    super.delete(...nodes)
    nodes.forEach((node) => node._onDeleteParent(this))
  }

  public batchDraw() {
    this.loopCasting = true
    if (!this.waitDrawing) {
      this.waitDrawing = true
      this.idRequestFrame = requestAnimationFrame(() => {
        this.draw()
        this.waitDrawing = false
        this.batchDraw()
      })
    }
  }

  public stopDraw() {
    if (!this.idRequestFrame) return

    this.waitDrawing = true
    cancelAnimationFrame(this.idRequestFrame)
    this.waitDrawing = false
    this.loopCasting = false
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
      this.#context.canvas.addEventListener(name, callback as unknown as any)
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
      this.#context.canvas.removeEventListener(
        name,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        callback as unknown as any
      )
    } else {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      this.listeners
        ?.get(name)!
        .forEach((cb) => this.#context.canvas.removeEventListener(name, cb))
    }

    super.off(name, callback)

    return this
  }

  public destroy(): void {
    this.stopDraw()
    this.children.forEach((node) => this.delete(node))
    this.listeners?.forEach((_cbs, name) => this.off(name))
    super.destroy()
    this.#context.canvas.remove()
  }
}
