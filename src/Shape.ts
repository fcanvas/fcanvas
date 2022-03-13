import { AttrsIdentifitation, ContainerNode } from "./Container";
import type { Layer } from "./Layer";
import { transparent } from "./constants/Colors";
import { createFilter, OptionFilter } from "./helpers/createFilter";
import { createTransform, OptionTransform } from "./helpers/createTransform";
import { Offset } from "./types/Offset";

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

export type AttrsDefault = Offset & {
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
    shadow?: {
      // eslint-disable-next-line functional/prefer-readonly-type
      color: Color;
      // eslint-disable-next-line functional/prefer-readonly-type
      blur: number;
      // eslint-disable-next-line functional/prefer-readonly-type
      offset?: Partial<Offset>;
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
  } & AttrsIdentifitation &
  OptionTransform & {
    // eslint-disable-next-line functional/prefer-readonly-type
    filter?: OptionFilter;
  };

export type EventsDefault = {
  /* @mouse event */
  // eslint-disable-next-line functional/prefer-readonly-type
  mouseover: MouseEvent;
  // eslint-disable-next-line functional/prefer-readonly-type
  mouseout: MouseEvent;
  // eslint-disable-next-line functional/prefer-readonly-type
  mouseenter: MouseEvent;
  // eslint-disable-next-line functional/prefer-readonly-type
  mouseleave: MouseEvent;
  // eslint-disable-next-line functional/prefer-readonly-type
  mousemove: MouseEvent;
  // eslint-disable-next-line functional/prefer-readonly-type
  mousedown: MouseEvent;
  // eslint-disable-next-line functional/prefer-readonly-type
  mouseup: MouseEvent;
  // eslint-disable-next-line functional/prefer-readonly-type
  wheel: WheelEvent;
  // eslint-disable-next-line functional/prefer-readonly-type
  click: MouseEvent;
  // eslint-disable-next-line functional/prefer-readonly-type
  dblclick: MouseEvent;

  /* touch event */
  // eslint-disable-next-line functional/prefer-readonly-type
  touchstart: TouchEvent;
  // eslint-disable-next-line functional/prefer-readonly-type
  touchmove: TouchEvent;
  // eslint-disable-next-line functional/prefer-readonly-type
  touchend: TouchEvent;
  // eslint-disable-next-line functional/prefer-readonly-type
  tap: TouchEvent;
  // eslint-disable-next-line functional/prefer-readonly-type
  dbltap: TouchEvent;
};

const EmptyArray: Iterable<number> = [];

export class Shape<
  Attrs extends Record<string, unknown> & AttrsDefault = AttrsDefault & {
    // eslint-disable-next-line functional/prefer-readonly-type
    width: number;
    // eslint-disable-next-line functional/prefer-readonly-type
    height: number;
  },
  Events extends Record<string, unknown> & EventsDefault = EventsDefault
> extends ContainerNode<Attrs, Events> {
  static readonly attrsReactSize: readonly string[] = ["width", "height"];
  static readonly type = "Shape";

  // eslint-disable-next-line functional/prefer-readonly-type
  public currentNeedReload = true;
  // @overwrite
  // eslint-disable-next-line @typescript-eslint/no-empty-function, @typescript-eslint/no-unused-vars
  protected _sceneFunc(context: CanvasRenderingContext2D) {}

  readonly #layers = new Set<Layer>();
  // eslint-disable-next-line functional/prefer-readonly-type
  #context?: CanvasRenderingContext2D;

  constructor(attrs: Attrs) {
    super(attrs, (prop) => {
      if (!this.#context || (prop !== "x" && prop !== "y")) {
        this.currentNeedReload = true;
      }

      this.#layers.forEach((layer) => {
        if (layer.currentNeedReload === true) return;
        layer.currentNeedReload = true;
      });

      if (
        (this.constructor as unknown as typeof Shape).attrsReactSize.some(
          (test) =>
            test === (prop as string) || test.startsWith(`${prop as string}.`)
        )
      ) {
        this.onresize();
      }
    });

    this.onresize();

    if (this.attrs.perfectDrawEnabled ?? true) {
      this.#context =
        document.createElement("canvas").getContext("2d") ?? void 0;
    }
  }

  // @overwrite
  public getInnerWidth(): number {
    return (this.attrs.width as number | undefined) ?? 0;
  }
  // @overwrite
  public getInnerHeight(): number {
    return (this.attrs.height as number | undefined) ?? 0;
  }

  public getWidth() {
    return (
      this.getInnerWidth() +
      (this.attrs.strokeWidth ?? 1) +
      (this.attrs.shadow?.offset?.x ?? 0)
    );
  }
  public getHeight() {
    return (
      this.getInnerHeight() +
      (this.attrs.strokeWidth ?? 1) +
      (this.attrs.shadow?.offset?.y ?? 0)
    );
  }
  private onresize() {
    // reactive
    if (this.#context) {
      // eslint-disable-next-line functional/immutable-data
      this.#context.canvas.width = this.getWidth();
      // eslint-disable-next-line functional/immutable-data
      this.#context.canvas.height = this.getHeight();
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
  private fillScene(context: CanvasRenderingContext2D) {
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

    // eslint-disable-next-line functional/immutable-data
    context.fillStyle = style ?? transparent;
    if (style) {
      context.fill();
    }
  }
  private strokeScene(context: CanvasRenderingContext2D) {
    const style = this.attrs.strokeEnabled ?? true ? this.attrs.stroke : void 0;

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
  private fillStrokeScene(context: CanvasRenderingContext2D) {
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
      context.shadowOffsetX = this.attrs.shadow.offset?.x ?? 0;
      // eslint-disable-next-line functional/immutable-data
      context.shadowOffsetY = this.attrs.shadow.offset?.y ?? 0;
      // eslint-disable-next-line functional/immutable-data
      context.shadowBlur = this.attrs.shadow.blur ?? 0;
    } else {
      if (context.shadowColor !== transparent) {
        // eslint-disable-next-line functional/immutable-data
        context.shadowColor = transparent;
      }
    }
  }
  private drawInSandBox(context: CanvasRenderingContext2D) {
    const scene = this.getSceneFunc();

    if (!scene) {
      return;
    }

    const needUseTransform =
      this.attrs.scale !== void 0 ||
      this.attrs.rotation !== void 0 ||
      this.attrs.offset !== void 0 ||
      this.attrs.skewX !== void 0 ||
      this.attrs.skewY !== void 0 ||
      !this.#context;
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
    this.fillStrokeScene(context);

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
  }

  protected getHitStroke() {
    return (
      (this.attrs.strokeHitEnabled ?? true
        ? this.attrs.hitStrokeWidth ?? this.attrs.strokeWidth
        : this.attrs.strokeWidth) ?? 1
    );
  }
  // @overwrite
  public isPressedPoint(x: number, y: number): boolean {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const hitStroke = this.getHitStroke();

    return x === this.attrs.x && y === this.attrs.y;
  }

  public _onAddToLayer(layer: Layer): void {
    this.#layers.add(layer);
  }
  public _onRemoveLayer(layer: Layer): void {
    this.#layers.delete(layer);
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
      context.drawImage(this.#context.canvas, this.attrs.x, this.attrs.y);
    } else {
      // キャッシュさせないでください
      this.drawInSandBox(context);
    }

    this.currentNeedReload = false;
  }
}
