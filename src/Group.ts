import { AttrsSelf, Container, VirualChildNode } from "./Container";
import type { Layer } from "./Layer";
import { Shape } from "./Shape";
import {
  AttrsDrawLayerContext,
  drawLayerContextUseOpacityClipTransformFilter,
} from "./helpers/drawLayerContextUseOpacityClipTransformFilter";
import { setNeedReloadParentTrue } from "./helpers/setNeedReloadParentTrue";
import { Offset } from "./types/Offset";

type Attrs = Offset & {
  // eslint-disable-next-line functional/prefer-readonly-type
  width?: number;
  // eslint-disable-next-line functional/prefer-readonly-type
  height?: number;
  // eslint-disable-next-line functional/prefer-readonly-type
  visible?: boolean;
} & AttrsDrawLayerContext;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type IChild = Shape<any, any> | Group<any>;
export class Group<
    ChildNode extends VirualChildNode & {
      // eslint-disable-next-line functional/no-method-signature
      isPressedPoint(x: number, y: number): boolean;
      // eslint-disable-next-line functional/prefer-readonly-type
      getClientRect: Shape["getClientRect"];
      // eslint-disable-next-line functional/no-method-signature
      draw(context: CanvasRenderingContext2D): void;
    } = IChild
  >
  extends Container<
    Attrs,
    // eslint-disable-next-line @typescript-eslint/ban-types
    {},
    ChildNode
  >
  implements VirualChildNode
{
  static readonly type: string = "Group";

  public readonly parents = new Set<Layer | Group>();

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  readonly #context = document.createElement("canvas").getContext("2d")!;

  constructor(attrs: AttrsSelf<Attrs>) {
    super(attrs, (prop) => {
      if (!this.#context || (prop !== "x" && prop !== "y")) {
        this.currentNeedReload = true;
      }

      setNeedReloadParentTrue(this.parents);
    });

    this.watch(
      ["width", "height"],
      () => {
        if (this.attrs.width === void 0 || this.attrs.height === void 0) return;

        this.#context.canvas.width = this.attrs.width;
        this.#context.canvas.height = this.attrs.height;
      },
      { immediate: true }
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public _onAddToParent(parent: Layer | Group<any>) {
    this.parents.add(parent);
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public _onDeleteParent(parent: Layer | Group<any>) {
    this.parents.delete(parent);
  }

  public _onChildResize() {
    if (this.attrs.width !== void 0 && this.attrs.height !== void 0) return;

    const { width, height } = this.getClientRect();
    [this.#context.canvas.width, this.#context.canvas.height] = [width, height];
    this.currentNeedReload = true;
    this.parents.forEach((parent) => {
      if (parent instanceof Group) {
        parent._onChildResize();
      }
    });
  }

  // eslint-disable-next-line functional/functional-parameters, functional/prefer-readonly-type
  public add(...nodes: ChildNode[]) {
    super.add(...nodes);
    this._onChildResize();
  }
  // eslint-disable-next-line functional/functional-parameters, functional/prefer-readonly-type
  public delete(...nodes: ChildNode[]) {
    super.delete(...nodes);
    this._onChildResize();
  }

  public isPressedPoint(x: number, y: number): boolean {
    return Array.from(this.children.values()).some((node) =>
      node.isPressedPoint(x, y)
    );
  }

  public getClientRect(
    config: {
      // eslint-disable-next-line functional/prefer-readonly-type
      skipTransform?: boolean;
      // eslint-disable-next-line functional/prefer-readonly-type
      skipStroke?: boolean;
      // eslint-disable-next-line functional/prefer-readonly-type
      skipShadow?: boolean;
    } = {}
  ) {
    // eslint-disable-next-line functional/no-let
    let x = Infinity,
      y = -Infinity,
      width = 0,
      height = 0,
      fillWidth = 0,
      fillHeight = 0;
    this.children.forEach((node) => {
      const clientRect = node.getClientRect(config);

      x = Math.min(x, clientRect.x);
      y = Math.max(y, clientRect.y);

      const sumWidth = clientRect.x + clientRect.width;
      const sumHeight = clientRect.y + clientRect.height;

      fillWidth = Math.max(fillWidth, sumWidth);
      fillHeight = Math.max(fillHeight, sumHeight);
      if (fillWidth === sumWidth) {
        width = clientRect.width;
      }
      if (fillHeight === sumHeight) {
        height = clientRect.height;
      }
    });

    return {
      x,
      y,
      width,
      height,
    };
  }

  public draw(context: CanvasRenderingContext2D) {
    if (!(this.attrs.visible ?? true)) return;
    
    const { x, y } = this.getClientRect();
    if (this.currentNeedReload) {
      this.#context.clearRect(
        0,
        0,
        this.#context.canvas.width,
        this.#context.canvas.height
      );
      
      if (x !== 0 || y !== 0) {
        this.#context.translate(-x, -y);
      }
      drawLayerContextUseOpacityClipTransformFilter(
        this.#context,
        this.attrs,
        this.children,
        this
      );
      if (x !== 0 || y !== 0) {
        this.#context.translate(x, y);
      }

      this.currentNeedReload = false;
    }

    context.drawImage(this.#context.canvas, this.attrs.x + x, this.attrs.y + y);
  }
}
