import type { AttrsSelf, VirtualChildNode } from "./Container"
import { ContainerCanvas } from "./Container"
import type { Layer } from "./Layer"
import type { Shape } from "./Shape"
import { Utils } from "./Utils"
import type { AttrsDrawLayerContext } from "./helpers/drawLayerContextUseOpacityClipTransformFilter"
import { drawLayerContextUseOpacityClipTransformFilter } from "./helpers/drawLayerContextUseOpacityClipTransformFilter"
import type { realMousePosition } from "./helpers/realMousePosition"
import { setNeedReloadParentTrue } from "./helpers/setNeedReloadParentTrue"
import { getClientRectGroup } from "./methods/getClientRectGroup"
import type AllShape from "./types/AllShape"
import type { ClientRectOptions } from "./types/ClientRectOptions"
import type { Offset } from "./types/Offset"

type Attrs<Node> = Offset & {
  width?: number

  height?: number

  visible?: boolean

  filterItem?: (node: Node, index: number) => void | boolean
} & AttrsDrawLayerContext

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type IChild = AllShape | Group<any>
export type IChildrenAllowGroup = VirtualChildNode & {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  readonly attrs: any
  // eslint-disable-next-line functional/no-method-signature
  isPressedPoint(x: number, y: number): boolean

  getClientRect: Shape["getClientRect"]

  getSelfRect?: Shape["getSelfRect"]
  // eslint-disable-next-line functional/no-method-signature
  draw(context: CanvasRenderingContext2D): void
}
export class Group<
    ChildNode extends IChildrenAllowGroup = IChild,
    AttrsRefs extends Record<string, unknown> = Record<string, unknown>,
    AttrsRaws extends Record<string, unknown> = Record<string, unknown>
  >
  extends ContainerCanvas<
    Attrs<ChildNode>,
    // eslint-disable-next-line @typescript-eslint/ban-types
    {},
    ChildNode,
    AttrsRefs,
    AttrsRaws
  >
  implements VirtualChildNode {
  static readonly type: string = "Group"

  public readonly parents = new Set<Layer | Group>()

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  readonly #context = Utils.createCanvas().getContext("2d")!

  constructor(attrs: AttrsSelf<Attrs<ChildNode>, AttrsRefs, AttrsRaws>) {
    super(attrs, (prop) => {
      if (!this.#context || (prop !== "x" && prop !== "y"))
        this.currentNeedReload = true

      setNeedReloadParentTrue(this.parents)
    })

    this.watch(
      ["width", "height"],
      () => {
        if (this.attrs.width === void 0 || this.attrs.height === void 0) return

        this.#context.canvas.width = this.attrs.width
        this.#context.canvas.height = this.attrs.height
      },
      { immediate: true }
    )
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public _onAddToParent(parent: Layer | Group<any>) {
    this.parents.add(parent)
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public _onDeleteParent(parent: Layer | Group<any>) {
    this.parents.delete(parent)
  }

  public _onChildResize() {
    if (this.attrs.width !== void 0 && this.attrs.height !== void 0) return

    const { width, height } = this.getClientRect()
    ;[this.#context.canvas.width, this.#context.canvas.height] = [width, height]
    this.currentNeedReload = true
    this.parents.forEach((parent) => {
      if (parent instanceof Group) parent._onChildResize()
    })
  }

  // eslint-disable-next-line functional/functional-parameters
  public add(...nodes: ChildNode[]) {
    super.add(...nodes)
    this._onChildResize()
  }

  // eslint-disable-next-line functional/functional-parameters
  public delete(...nodes: ChildNode[]) {
    super.delete(...nodes)
    this._onChildResize()
  }

  protected nodeHaveInClients(
    node: ChildNode,
    clients: readonly ReturnType<typeof realMousePosition>[]
  ): boolean {
    return clients.some((item) =>
      node.isPressedPoint?.(item.x - this.attrs.x, item.y - this.attrs.y)
    )
  }

  public isPressedPoint(x: number, y: number, event?: Event): boolean {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    this.fireChild(event!)

    for (const node of this.children.values())
      if (node.isPressedPoint(x, y)) return true

    return false
  }

  public getClientRect(config: ClientRectOptions = {}) {
    return getClientRectGroup(this.children, config)
  }

  public draw(context: CanvasRenderingContext2D) {
    if (this.attrs.visible === false) return

    const { x, y } = this.getClientRect()
    if (this.currentNeedReload) {
      this.#context.clearRect(
        0,
        0,
        this.#context.canvas.width,
        this.#context.canvas.height
      )

      if (x !== 0 || y !== 0) this.#context.translate(-x, -y)

      drawLayerContextUseOpacityClipTransformFilter(
        this.#context,
        this.attrs,
        this.children,
        this.attrs.filterItem,
        this
      )
      if (x !== 0 || y !== 0) this.#context.translate(x, y)

      this.currentNeedReload = false
    }

    context.drawImage(this.#context.canvas, this.attrs.x + x, this.attrs.y + y)
  }
}
