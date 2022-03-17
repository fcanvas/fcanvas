import { transparent } from "./Colors";
import { ContainerNode } from "./Container";
import { Group } from "./Group";
import type { Layer } from "./Layer";
import { createFilter, OptionFilter } from "./helpers/createFilter";
import { createTransform, OptionTransform } from "./helpers/createTransform";
import { pointInBox } from "./helpers/pointInBox";
import { setNeedReloadParentTrue } from "./helpers/setNeedReloadParentTrue";
import { transformedRect } from "./helpers/transformerRect";
import { Offset } from "./types/Offset";
import { Size } from "./types/Size";

// add ctx.filter
type Color = string;
type FillStyle = CanvasGradient | CanvasPattern | Color;

type bool = boolean;

type FillModeColor = {
  // eslint-disable-next-line functional/prefer-readonly-type
  fill: FillStyle;
};
type FillModePattern = {
  /* fill pattern */
  // eslint-disable-next-line functional/prefer-readonly-type
  fillPatternImage: CanvasImageSource;
  // eslint-disable-next-line functional/prefer-readonly-type
  fillPattern?: {
    // eslint-disable-next-line functional/prefer-readonly-type
    x?: number;
    // eslint-disable-next-line functional/prefer-readonly-type
    y?: number;
    // eslint-disable-next-line functional/prefer-readonly-type
    offset?: Partial<Offset>;
    // eslint-disable-next-line functional/prefer-readonly-type
    scale?: Partial<Offset>;
    // eslint-disable-next-line functional/prefer-readonly-type
    rotation?: number;
    // eslint-disable-next-line functional/prefer-readonly-type
    repeat?: "repeat" | "repeat-x" | "repeat-y" | "no-repeat";
  };
  /* /pattern */
};
type FillModeLinearGradient = {
  /* fill linear gradient */
  // eslint-disable-next-line functional/prefer-readonly-type
  fillLinearGradient: {
    // eslint-disable-next-line functional/prefer-readonly-type
    start: Offset;
    // eslint-disable-next-line functional/prefer-readonly-type
    end: Offset;
    // eslint-disable-next-line functional/prefer-readonly-type
    colorStops: [number, string][];
  };
  /* /linear-gradient */
};
type FillModeRadialGradient = {
  /* fill radial gradient */
  // eslint-disable-next-line functional/prefer-readonly-type
  fillRadialGradient: {
    // eslint-disable-next-line functional/prefer-readonly-type
    start: Offset;
    // eslint-disable-next-line functional/prefer-readonly-type
    startRadius: number;
    // eslint-disable-next-line functional/prefer-readonly-type
    end: Offset;
    // eslint-disable-next-line functional/prefer-readonly-type
    endRadius: number;
    // eslint-disable-next-line functional/prefer-readonly-type
    colorStops: [number, string][];
  };
  /* /radial-gradient */
};

type FillModeMixture = {
  // eslint-disable-next-line functional/prefer-readonly-type
  fillPriority: "color" | "linear-gradient" | "radial-gradient" | "pattern";
} & Partial<FillModeColor> &
  Partial<FillModePattern> &
  Partial<FillModeLinearGradient> &
  Partial<FillModeRadialGradient>;

type AttrsDefault = Offset & {
  // eslint-disable-next-line functional/prefer-readonly-type
  fillAfterStrokeEnabled?: boolean;
  // eslint-disable-next-line functional/prefer-readonly-type
  fillEnabled?: bool;
  // eslint-disable-next-line functional/prefer-readonly-type
  stroke?: FillStyle;
  // eslint-disable-next-line functional/prefer-readonly-type
  strokeWidth?: number;
  // eslint-disable-next-line functional/prefer-readonly-type
  strokeEnabled?: boolean;
  // eslint-disable-next-line functional/prefer-readonly-type
  hitStrokeWidth?: number;
  // eslint-disable-next-line functional/prefer-readonly-type
  strokeHitEnabled?: boolean;
  // eslint-disable-next-line functional/prefer-readonly-type
  perfectDrawEnabled?: boolean;
  // eslint-disable-next-line functional/prefer-readonly-type
  shadowForStrokeEnabled?: boolean;
  // strokeScaleEnabled?: boolean
  // eslint-disable-next-line functional/prefer-readonly-type
  lineJoin?: "bevel" | "round" | "miter";
  // eslint-disable-next-line functional/prefer-readonly-type
  lineCap?: "butt" | "round" | "square";
  // eslint-disable-next-line functional/prefer-readonly-type
  sceneFunc?: (context: CanvasRenderingContext2D) => void;
} & Partial<FillModeMixture> /* & FillModeMonopole*/ & {
    // eslint-disable-next-line functional/prefer-readonly-type
    shadowEnabled?: boolean;
    // eslint-disable-next-line functional/prefer-readonly-type
    shadow?: Partial<Offset> & {
      // eslint-disable-next-line functional/prefer-readonly-type
      color: Color;
      // eslint-disable-next-line functional/prefer-readonly-type
      blur: number;
      // opacity?: number
    };
  } & {
    // eslint-disable-next-line functional/prefer-readonly-type
    dash?: number[];
    // eslint-disable-next-line functional/prefer-readonly-type
    dashEnabled?: boolean;
    // eslint-disable-next-line functional/prefer-readonly-type
    visible?: boolean;
    // eslint-disable-next-line functional/prefer-readonly-type
    opacity?: number;
  } & OptionTransform & {
    // eslint-disable-next-line functional/prefer-readonly-type
    filter?: OptionFilter;
  };

const EmptyArray: Iterable<number> = [];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AttrsShapeSelf<T extends Record<string, any>> = AttrsDefault & T;
export class Shape<
  AttrsCustom extends Record<string, unknown> = {
    // eslint-disable-next-line functional/prefer-readonly-type
    width: number;
    // eslint-disable-next-line functional/prefer-readonly-type
    height: number;
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
  EventsCustom extends Record<string, any> = {},
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  IParent extends Layer | Group<any> = Layer | Group,
  Attrs extends AttrsShapeSelf<AttrsCustom> = AttrsShapeSelf<AttrsCustom>,
  Events extends EventsCustom = EventsCustom
> extends ContainerNode<Attrs, Events, IParent> {
  static readonly attrsReactSize: readonly string[] = ["width", "height"];
  static readonly type: string = "Shape";

  public readonly _centroid: boolean = false;

  // @overwrite
  // eslint-disable-next-line @typescript-eslint/no-empty-function, @typescript-eslint/no-unused-vars
  protected _sceneFunc(_context: CanvasRenderingContext2D) {}

  // eslint-disable-next-line functional/prefer-readonly-type
  #context?: CanvasRenderingContext2D;

  constructor(attrs: Attrs) {
    super(attrs, (prop) => {
      if (!this.#context || (prop !== "x" && prop !== "y")) {
        this.currentNeedReload = true;
      }

      setNeedReloadParentTrue(this.parents);

      const sizeChanged = (
        this.constructor as unknown as typeof Shape
      ).attrsReactSize.some(
        (test) =>
          test === (prop as string) || test.startsWith(`${prop as string}.`)
      );
      if (sizeChanged) {
        this.onresize();
      }
      if (sizeChanged || prop === "x" || prop === "y") {
        this.parents.forEach((parent) => {
          if (parent instanceof Group) {
            parent._onChildResize();
          }
        });
      }
    });

    this.onresize();

    if (this.attrs.perfectDrawEnabled ?? true) {
      this.#context =
        document.createElement("canvas").getContext("2d") ?? void 0;
    }
  }
  protected size(): Size {
    return {
      width: this.attrs.width as number,
      height: this.attrs.height as number,
    };
  }
  public getSelfRect(): Offset & Size {
    const size = this.size();

    return {
      x: this._centroid ? -size.width / 2 : 0,
      y: this._centroid ? -size.height / 2 : 0,
      width: size.width,
      height: size.height,
    };
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
    const fillRect = this.getSelfRect();

    const applyStroke =
      !config.skipStroke &&
      (this.attrs.strokeEnabled ?? true) &&
      this.attrs.stroke !== void 0;
    const strokeWidth = (applyStroke && (this.attrs.strokeWidth ?? 1)) || 0;

    const fillAndStrokeWidth = fillRect.width + strokeWidth;
    const fillAndStrokeHeight = fillRect.height + strokeWidth;

    const applyShadow =
      !config.skipShadow &&
      (this.attrs.shadowEnabled ?? true) &&
      this.attrs.shadow !== void 0;
    const shadowOffsetX = applyShadow ? this.attrs.shadow?.x ?? 0 : 0;
    const shadowOffsetY = applyShadow ? this.attrs.shadow?.y ?? 0 : 0;

    const preWidth = fillAndStrokeWidth + Math.abs(shadowOffsetX);
    const preHeight = fillAndStrokeHeight + Math.abs(shadowOffsetY);

    const blurRadius = (applyShadow && (this.attrs.shadow?.blur ?? 0)) || 0;

    const width = preWidth + blurRadius * 2;
    const height = preHeight + blurRadius * 2;

    const rect = {
      width: width,
      height: height,
      x:
        -(strokeWidth / 2 + blurRadius) +
        Math.min(shadowOffsetX, 0) +
        fillRect.x,
      y:
        -(strokeWidth / 2 + blurRadius) +
        Math.min(shadowOffsetY, 0) +
        fillRect.y,
    };

    const applyTransform = !config.skipTransform && this.transformExists();
    if (applyTransform) {
      return transformedRect(rect, createTransform(this.attrs));
    }

    return rect;
  }

  private onresize() {
    // reactive
    if (this.#context) {
      const { width, height } = this.getClientRect();
      [this.#context.canvas.width, this.#context.canvas.height] = [
        width,
        height,
      ];
    }
  }
  private getSceneFunc() {
    return this.attrs.sceneFunc || this._sceneFunc;
  }
  private getFillPriority(): FillModeMixture["fillPriority"] {
    if (this.attrs.fillPriority) {
      return this.attrs.fillPriority as FillModeMixture["fillPriority"];
    }

    if (this.attrs.fillPatternImage !== void 0) {
      return "pattern";
    }
    if (this.attrs.fillLinearGradient !== void 0) {
      return "linear-gradient";
    }
    if (this.attrs.fillRadialGradient !== void 0) {
      return "radial-gradient";
    }

    return "color";
  }
  protected getFill(context: CanvasRenderingContext2D) {
    // eslint-disable-next-line functional/no-let
    let style: FillStyle | void;
    // "color" | "linear-gradient" | "radial-graident" | "pattern"
    // fill pattern is preferred
    // các tổ hợp của nó được ưu tiên
    switch ((this.attrs.fillEnabled ?? true) && this.getFillPriority()) {
      case "color":
        style = this.attrs.fill;
        break;
      case "pattern":
        if (this.attrs.fillPatternImage !== void 0) {
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          style = context.createPattern(
            this.attrs.fillPatternImage,
            this.attrs.fillPattern?.repeat ?? "repeat"
          )!;
          style.setTransform(
            new DOMMatrix()
              .skewX(this.attrs.fillPattern?.x ?? 1)
              .skewY(this.attrs.fillPattern?.y ?? 1)
              .translate(
                this.attrs.fillPattern?.offset?.x ?? 0,
                this.attrs.fillPattern?.offset?.y ?? 0
              )
              .scale(
                this.attrs.fillPattern?.scale?.x ?? 1,
                this.attrs.fillPattern?.scale?.y ?? 1
              )
              .rotate(this.attrs.fillPattern?.rotation ?? 0)
          );
        }
        break;
      case "linear-gradient":
        if (this.attrs.fillLinearGradient !== void 0) {
          style = context.createLinearGradient(
            this.attrs.fillLinearGradient.start.x,
            this.attrs.fillLinearGradient.start.y,
            this.attrs.fillLinearGradient.end.x,
            this.attrs.fillLinearGradient.end.y
          );
          this.attrs.fillLinearGradient.colorStops.forEach(([color, point]) => {
            (style as CanvasGradient).addColorStop(color, point);
          });
        }
        break;
      case "radial-gradient":
        if (this.attrs.fillRadialGradient !== void 0) {
          style = context.createRadialGradient(
            this.attrs.fillRadialGradient.start.x,
            this.attrs.fillRadialGradient.start.y,
            this.attrs.fillRadialGradient.startRadius,
            this.attrs.fillRadialGradient.end.x,
            this.attrs.fillRadialGradient.end.y,
            this.attrs.fillRadialGradient.endRadius
          );
          this.attrs.fillRadialGradient.colorStops.forEach(([color, point]) => {
            (style as CanvasGradient).addColorStop(color, point);
          });
        }
        break;
    }

    return style;
  }
  protected fillScene(context: CanvasRenderingContext2D, path?: Path2D) {
    const style = this.getFill(context);
    // eslint-disable-next-line functional/immutable-data
    context.fillStyle = style ?? transparent;
    if (style) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      context.fill(path!);
    }
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected getStroke(_context: CanvasRenderingContext2D) {
    return this.attrs.strokeEnabled ?? true ? this.attrs.stroke : void 0;
  }
  protected strokeScene(context: CanvasRenderingContext2D) {
    const style = this.getStroke(context);

    // eslint-disable-next-line functional/immutable-data
    context.strokeStyle = style ?? transparent;
    if (style) {
      context.stroke();
    }
  }
  private lineSet(context: CanvasRenderingContext2D) {
    if (!(this.attrs.strokeEnabled ?? true)) {
      return;
    }

    if (this.attrs.strokeWidth !== void 0) {
      // eslint-disable-next-line functional/immutable-data
      context.lineWidth = this.attrs.strokeWidth;
    }

    // eslint-disable-next-line functional/immutable-data
    context.lineJoin = this.attrs.lineJoin ?? "miter";
    // eslint-disable-next-line functional/immutable-data
    context.lineCap = this.attrs.lineCap ?? "butt";

    if (this.attrs.dashEnabled ?? true) {
      context.setLineDash(this.attrs.dash ?? EmptyArray);
    } else {
      if (context.getLineDash().length) {
        context.setLineDash(EmptyArray);
      }
    }
  }
  protected fillStrokeScene(context: CanvasRenderingContext2D) {
    const shadowForStrokeEnabled = this.attrs.shadowForStrokeEnabled ?? true;
    if (this.attrs.fillAfterStrokeEnabled) {
      if (shadowForStrokeEnabled) {
        this.shadowScene(context);
        this.strokeScene(context);
      } else {
        this.strokeScene(context);
        this.shadowScene(context);
      }
      this.fillScene(context);
    } else {
      this.shadowScene(context);
      this.fillScene(context);
      if (!shadowForStrokeEnabled) {
        // eslint-disable-next-line functional/immutable-data
        context.shadowBlur = 0;
        // eslint-disable-next-line functional/immutable-data
        context.shadowColor = transparent;
      }
      this.strokeScene(context);
    }
  }
  private shadowScene(context: CanvasRenderingContext2D) {
    if ((this.attrs.shadowEnabled ?? true) && this.attrs.shadow !== void 0) {
      // eslint-disable-next-line functional/immutable-data
      context.shadowColor = this.attrs.shadow.color;
      // eslint-disable-next-line functional/immutable-data
      context.shadowOffsetX = this.attrs.shadow?.x ?? 0;
      // eslint-disable-next-line functional/immutable-data
      context.shadowOffsetY = this.attrs.shadow?.y ?? 0;
      // eslint-disable-next-line functional/immutable-data
      context.shadowBlur = this.attrs.shadow.blur ?? 0;
    } else {
      if (context.shadowColor !== transparent) {
        // eslint-disable-next-line functional/immutable-data
        context.shadowColor = transparent;
      }
    }
  }
  private transformExists() {
    return (
      this.attrs.scale !== void 0 ||
      this.attrs.rotation !== void 0 ||
      this.attrs.offset !== void 0 ||
      this.attrs.skewX !== void 0 ||
      this.attrs.skewY !== void 0
    );
  }
  private drawInSandBox(context: CanvasRenderingContext2D) {
    const scene = this.getSceneFunc();

    if (!scene) {
      return;
    }

    // eslint-disable-next-line functional/no-let
    let transX: number, transY: number;
    if (this._centroid) {
      const { x, y } = this.getSelfRect();
      [transX, transY] = [x, y];
      context.translate(-x, -y);
    }
    const needUseTransform = this.transformExists() && !this.#context;
    const needSetAlpha = this.attrs.opacity !== void 0;
    const useFilter = this.attrs.filter !== void 0;
    // eslint-disable-next-line functional/no-let
    let backupTransform, backupAlpha: number, backupFilter: string;

    if (needSetAlpha) {
      backupAlpha = context.globalAlpha;
      // eslint-disable-next-line functional/immutable-data, @typescript-eslint/no-non-null-assertion
      context.globalAlpha = this.attrs.opacity!;
    }
    if (needUseTransform) {
      backupTransform = context.getTransform();

      context.setTransform(createTransform(this.attrs, !this.#context));
    }
    if (useFilter) {
      backupFilter = context.filter;

      // eslint-disable-next-line functional/immutable-data, @typescript-eslint/no-non-null-assertion
      context.filter = createFilter(this.attrs.filter!);
    }

    context.beginPath();

    this.lineSet(context);
    scene?.call(this, context);
    // this.fillStrokeScene(context);

    context.closePath();

    if (useFilter) {
      // eslint-disable-next-line functional/immutable-data, @typescript-eslint/no-non-null-assertion
      context.filter = backupFilter!;
    }
    if (needUseTransform) {
      context.setTransform(backupTransform);
    }
    if (needSetAlpha) {
      // eslint-disable-next-line functional/immutable-data, @typescript-eslint/no-non-null-assertion
      context.globalAlpha = backupAlpha!;
    }
    if (this._centroid) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      context.translate(transX!, transY!);
    }
  }

  protected getHitStroke() {
    return (
      ((this.attrs.strokeHitEnabled ?? true
        ? this.attrs.hitStrokeWidth ?? this.attrs.strokeWidth
        : this.attrs.strokeWidth) ?? 1) - 1
    );
  }
  // @overwrite
  public isPressedPoint(x: number, y: number): boolean {
    const hitStroke = this.getHitStroke();

    const selfRect = this.getSelfRect();

    return pointInBox(
      x,
      y,
      this.attrs.x + selfRect.x - hitStroke,
      this.attrs.y + selfRect.y - hitStroke,
      selfRect.width + hitStroke,
      selfRect.height + hitStroke
    );
  }

  draw(context: CanvasRenderingContext2D) {
    if (!(this.attrs.visible ?? true)) {
      return;
    }
    // ...
    if (this.#context) {
      // caching mode
      if (this.currentNeedReload) {
        this.#context.clearRect(
          0,
          0,
          this.#context.canvas.width,
          this.#context.canvas.height
        );
        this.drawInSandBox(this.#context);
      }

      // finished drawing in the cache
      // draw to main context
      const { x, y } = this.getSelfRect();
      context.drawImage(
        this.#context.canvas,
        this.attrs.x + x,
        this.attrs.y + y
      );
    } else {
      // キャッシュさせないでください
      this.drawInSandBox(context);
    }

    this.currentNeedReload = false;
  }
}
