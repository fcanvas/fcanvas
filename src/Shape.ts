/* eslint-disable functional/prefer-readonly-type */
import { Container } from "./Container";
import { transparent } from "./constants/Colors";
import { createProxy } from "./helpers/createProxy";

type Color = string;
type FillStyle = CanvasGradient | CanvasPattern | Color;
type Offset = {
  x: number;
  y: number;
};
type bool = boolean;

type FillModeColor = {
  fill: FillStyle;
};
type FillModePattern = {
  /* fill pattern */
  fillPatternImage: CanvasImageSource;
  fillPattern?: {
    x?: number;
    y?: number;
    offset?: Partial<Offset>;
    scale?: Partial<Offset>;
    rotation?: number;
    repeat?: "repeat" | "repeat-x" | "repeat-y" | "no-repeat";
  };
  /* /pattern */
};
type FillModeLinearGradient = {
  /* fill linear gradient */
  fillLinearGradient: {
    start: Offset;
    end: Offset;
    colorStops: [number, string][];
  };
  /* /linear-gradient */
};
type FillModeRadialGradient = {
  /* fill radial gradient */
  fillRadialGradient: {
    start: Offset;
    startRadius: number;
    end: Offset;
    endRadius: number;
    colorStops: [number, string][];
  };
  /* /radial-gradient */
};

type FillModeMixture = {
  fillPriority: "color" | "linear-gradient" | "radial-gradient" | "pattern";
} & Partial<FillModeColor> &
  Partial<FillModePattern> &
  Partial<FillModeLinearGradient> &
  Partial<FillModeRadialGradient>;

type AttrsDefault = Offset & {
  fillAfterStrokeEnabled?: boolean;
  fillEnabled?: bool;
  stroke?: FillStyle;
  strokeWidth?: number;
  strokeEnabled?: boolean;
  hitStrokeWidth?: number;
  strokeHitEnabled?: boolean;
  perfectDrawEnabled?: boolean;
  shadowForStrokeEnabled?: boolean;
  // strokeScaleEnabled?: boolean
  lineJoin?: "bevel" | "round" | "miter";
  lineCap?: "butt" | "round" | "square";
} & Partial<FillModeMixture> /* & FillModeMonopole*/ & {
    shadowEnabled?: boolean;
    shadow?: {
      color: Color;
      blur: number;
      offset?: Partial<Offset>;
      // opacity?: number
    };
  } & {
    dash?: number[];
    dashEnabled?: boolean;
    visible?: boolean;
    id?: string;
    name?: string;
  } & {
    opacity?: number;
    scale?: Partial<Offset>;
    rotation?: number;
    offset?: Partial<Offset>;
  };

const EmptyArray: Iterable<number> = [];

const idsUsed = new Set<string>();

export class Shape<
  Attrs extends Record<string, unknown> & AttrsDefault,
  Events extends Record<string, unknown>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
> extends Container<Shape<any, any>> {
  readonly type = "Shape";

  public get name() {
    return this.#attrs.name || "";
  }
  public get id() {
    return this.#attrs.id;
  }

  readonly #attrs: Attrs;
  // readonly #propWatch = <st;ring[]>[]
  public needReload = true;
  public parentNeedReloading = true;
  // eslint-disable-next-line @typescript-eslint/no-empty-function, @typescript-eslint/no-unused-vars
  public _sceneFunc(context: CanvasRenderingContext2D) {}

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public readonly listeners = new Map<
    keyof Events,
    Array<(event: any) => void>
  >();

  #context?: CanvasRenderingContext2D;

  constructor(attrs: Attrs) {
    super();
    if (attrs.id !== void 0) {
      if (idsUsed.has(attrs.id)) {
        // eslint-disable-next-line functional/no-throw-statement
        throw new Error(`ID "${attrs.id}" was used!`);
      }

      idsUsed.add(attrs.id);
    }
    this.#attrs = createProxy(attrs, (prop, val) => {
      if (prop !== "x" && prop !== "y") {
        this.needReload = true;
      } else {
        this.parentNeedReloading = true;
      }

      if (prop === "width" || prop === "height" || prop === "radius") {
        // resize
        if (this.#context) {
          if (prop === "radius") {
            this.#context.canvas.width = val as number;
            this.#context.canvas.height = val as number;
          } else {
            this.#context.canvas[prop as "width" | "height"] = val as number;
          }
        }
      }
    });

    if (this.#attrs.perfectDrawEnabled ?? true) {
      this.#context =
        document.createElement("canvas").getContext("2d") ?? void 0;
    }
  }

  public getWidth(): number {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return ((this.#attrs.radius as number) ?? this.#attrs.width)!;
  }
  public getHeight(): number {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return ((this.#attrs.radius as number) ?? this.#attrs.height)!;
  }

  private getSceneFunc() {
    return this._sceneFunc || this.#attrs.sceneFunc;
  }
  private getFillPriority(): FillModeMixture["fillPriority"] {
    if (this.#attrs.fillPriority) {
      return this.#attrs.fillPriority as FillModeMixture["fillPriority"];
    }

    if (this.#attrs.fillPatternImage !== void 0) {
      return "pattern";
    }
    if (this.#attrs.fillLinearGradient !== void 0) {
      return "linear-gradient";
    }
    if (this.#attrs.fillRadialGradient !== void 0) {
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
    switch ((this.#attrs.fillEnabled ?? true) && this.getFillPriority()) {
      case "color":
        style = this.#attrs.fill;
        break;
      case "pattern":
        if (this.#attrs.fillPatternImage !== void 0) {
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          style = context.createPattern(
            this.#attrs.fillPatternImage,
            this.#attrs.fillPattern?.repeat ?? "repeat"
          )!;
          style.setTransform(
            new DOMMatrix()
              .skewX(this.#attrs.fillPattern?.x ?? 1)
              .skewY(this.#attrs.fillPattern?.y ?? 1)
              .translate(
                this.#attrs.fillPattern?.offset?.x ?? 0,
                this.#attrs.fillPattern?.offset?.y ?? 0
              )
              .scale(
                this.#attrs.fillPattern?.scale?.x ?? 1,
                this.#attrs.fillPattern?.scale?.y ?? 1
              )
              .rotate(this.#attrs.fillPattern?.rotation ?? 0)
          );
        }
        break;
      case "linear-gradient":
        if (this.#attrs.fillLinearGradient !== void 0) {
          style = context.createLinearGradient(
            this.#attrs.fillLinearGradient.start.x,
            this.#attrs.fillLinearGradient.start.y,
            this.#attrs.fillLinearGradient.end.x,
            this.#attrs.fillLinearGradient.end.y
          );
          this.#attrs.fillLinearGradient.colorStops.forEach(
            ([color, point]) => {
              (style as CanvasGradient).addColorStop(color, point);
            }
          );
        }
        break;
      case "radial-gradient":
        if (this.#attrs.fillRadialGradient !== void 0) {
          style = context.createRadialGradient(
            this.#attrs.fillRadialGradient.start.x,
            this.#attrs.fillRadialGradient.start.y,
            this.#attrs.fillRadialGradient.startRadius,
            this.#attrs.fillRadialGradient.end.x,
            this.#attrs.fillRadialGradient.end.y,
            this.#attrs.fillRadialGradient.endRadius
          );
          this.#attrs.fillRadialGradient.colorStops.forEach(
            ([color, point]) => {
              (style as CanvasGradient).addColorStop(color, point);
            }
          );
        }
        break;
    }

    // eslint-disable-next-line functional/immutable-data
    context.fillStyle = style ?? transparent;
    context.fill();
  }
  private strokeScene(context: CanvasRenderingContext2D) {
    // eslint-disable-next-line functional/immutable-data
    context.strokeStyle =
      this.#attrs.strokeEnabled ?? true
        ? this.#attrs.stroke ?? transparent
        : transparent;
    context.stroke();
  }
  private lineSet(context: CanvasRenderingContext2D) {
    if (!(this.#attrs.strokeEnabled ?? true)) {
      return;
    }

    if (this.#attrs.strokeWidth !== void 0) {
      // eslint-disable-next-line functional/immutable-data
      context.lineWidth = this.#attrs.strokeWidth;
    }

    // eslint-disable-next-line functional/immutable-data
    context.lineJoin = this.#attrs.lineJoin ?? "miter";
    // eslint-disable-next-line functional/immutable-data
    context.lineCap = this.#attrs.lineCap ?? "butt";

    if (this.#attrs.dashEnabled ?? true) {
      context.setLineDash(this.#attrs.dash ?? EmptyArray);
    } else {
      if (context.getLineDash().length) {
        context.setLineDash(EmptyArray);
      }
    }
  }
  private fillStrokeScene(context: CanvasRenderingContext2D) {
    const shadowForStrokeEnabled = this.#attrs.shadowForStrokeEnabled ?? true;
    if (this.#attrs.fillAfterStrokeEnabled) {
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
    if ((this.#attrs.shadowEnabled ?? true) && this.#attrs.shadow !== void 0) {
      // eslint-disable-next-line functional/immutable-data
      context.shadowColor = this.#attrs.shadow.color;
      // eslint-disable-next-line functional/immutable-data
      context.shadowOffsetX = this.#attrs.shadow.offset?.x ?? 0;
      // eslint-disable-next-line functional/immutable-data
      context.shadowOffsetY = this.#attrs.shadow.offset?.y ?? 0;
      // eslint-disable-next-line functional/immutable-data
      context.shadowBlur = this.#attrs.shadow.blur ?? 0;
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
      this.#attrs.scale !== void 0 ||
      this.#attrs.rotation !== void 0 ||
      this.#attrs.offset !== void 0 ||
      !this.#context;
    const needSetAlpha = this.#attrs.opacity !== void 0;
    // eslint-disable-next-line functional/no-let
    let backupTransform, backupAlpha: number;

    if (needSetAlpha) {
      backupAlpha = context.globalAlpha;
      // eslint-disable-next-line functional/immutable-data, @typescript-eslint/no-non-null-assertion
      context.globalAlpha = this.#attrs.opacity!;
    }
    if (needUseTransform) {
      backupTransform = context.getTransform();

      context.setTransform(
        new DOMMatrix()
          .scale(this.#attrs.scale?.x || 1, this.#attrs.scale?.y || 1)
          .rotate(this.#attrs.rotation || 0)
          .translate(
            (this.#attrs.offset?.x || 0) + this.#attrs.x,
            (this.#attrs.offset?.y || 0) + this.#attrs.y
          )
      );
    }

    context.beginPath();

    this.lineSet(context);
    scene?.(context);
    this.fillStrokeScene(context);

    context.closePath();

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
      (this.#attrs.strokeHitEnabled ?? true
        ? this.#attrs.hitStrokeWidth ?? this.#attrs.strokeWidth
        : this.#attrs.strokeWidth) ?? 1
    );
  }
  protected isPressedPoint(x: number, y: number): boolean {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const hitStroke = this.getHitStroke();

    return x === this.#attrs.x && y === this.#attrs.y;
  }
  public on<Name extends keyof Events>(
    name: Name,
    callback: (this: this, event: Events[Name]) => void
  ): this {
    const listeners = this.listeners.get(name);
    if (listeners) {
      // eslint-disable-next-line functional/immutable-data
      listeners.push(callback);
    } else {
      this.listeners.set(name, [callback]);
    }

    return this;
  }
  public off<Name extends keyof Events>(
    name: Name,
    callback?: (this: this, event: Events[Name]) => void
  ): this {
    const listeners = this.listeners.get(name);

    if (callback) {
      // eslint-disable-next-line functional/immutable-data
      listeners?.splice(listeners.indexOf(callback) >>> 0, 1);
    } else {
      // eslint-disable-next-line functional/immutable-data
      listeners?.splice(0);
    }

    return this;
  }
  public emit<Name extends keyof Events>(
    name: Name,
    event: Events[Name]
  ): this {
    this.listeners.get(name)?.forEach((cb) => {
      cb.call(this, event);
    });

    return this;
  }

  draw(context: CanvasRenderingContext2D) {
    if (!(this.#attrs.visible ?? true)) {
      return;
    }
    // ...
    if (this.#context) {
      // caching mode
      if (this.needReload) {
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
      context.drawImage(this.#context.canvas, this.#attrs.x, this.#attrs.y);
    } else {
      // キャッシュさせないでください
      this.drawInSandBox(context);
    }

    this.needReload = false;
  }
}
