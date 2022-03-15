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

export class Group
  extends Container<
    Attrs,
    // eslint-disable-next-line @typescript-eslint/ban-types
    {},
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Shape<any, any> | Group
  >
  implements VirualChildNode
{
  static readonly type: string = "Group";

  // eslint-disable-next-line functional/prefer-readonly-type
  public currentNeedReload = true;
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

  public _onAddToParent(parent: Layer | Group) {
    this.parents.add(parent);
  }
  public _onDeleteParent(parent: Layer | Group) {
    this.parents.delete(parent);
  }

  public _onChildResize() {
    if (this.attrs.width !== void 0 && this.attrs.height !== void 0) return;

    const { x, y, width, height } = this.getClientRect();
    [this.#context.canvas.width, this.#context.canvas.height] = [
      width + x,
      height + y,
    ];
    this.currentNeedReload = true;
    this.parents.forEach((parent) => {
      if (parent instanceof Group) {
        parent._onChildResize();
      }
    });
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
      y = Infinity,
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
    });

    return {
      x,
      y,
      width: fillWidth - x,
      height: fillHeight - y,
    };
  }

  public draw(context: CanvasRenderingContext2D) {
    if (!(this.attrs.visible ?? true)) return;
    if (this.currentNeedReload) {
      drawLayerContextUseOpacityClipTransformFilter(
        this.#context,
        true,
        this.attrs,
        this.children,
        this
      );

      this.currentNeedReload = false;
    }

    context.drawImage(this.#context.canvas, this.attrs.x, this.attrs.y);
  }
}
