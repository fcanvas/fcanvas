import { AttrListening, AttrsIdentifitation, Container } from "./Container";
import type { EventsDefault, Shape } from "./Shape";
import { createFilter, OptionFilter } from "./helpers/createFilter";
import { createTransform, OptionTransform } from "./helpers/createTransform";
import { realMousePosition } from "./helpers/realMousePosition";
import { Offset } from "./types/Offset";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Attrs<Events extends Record<string, any>> = Partial<Offset> &
  AttrsIdentifitation &
  AttrListening<Events> & {
    // eslint-disable-next-line functional/prefer-readonly-type
    clearBeforeDraw?: boolean;
    // eslint-disable-next-line functional/prefer-readonly-type
    width?: number;
    // eslint-disable-next-line functional/prefer-readonly-type
    height?: number;
    // eslint-disable-next-line functional/prefer-readonly-type
    visible?: boolean;
    // eslint-disable-next-line functional/prefer-readonly-type
    opacity?: number;
    // eslint-disable-next-line functional/prefer-readonly-type
    clip?:
      | (Offset & {
          // eslint-disable-next-line functional/prefer-readonly-type
          width: number;
          // eslint-disable-next-line functional/prefer-readonly-type
          height: number;
        })
      | ((this: Layer, context: Path2D) => void);
  } & OptionTransform & {
    // eslint-disable-next-line functional/prefer-readonly-type
    filter?: OptionFilter;
  };

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
  "dbltap",
];

type Events = HTMLElementEventMap;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class Layer extends Container<Attrs<Events>, Events, Shape<any, any>> {
  static readonly _attrNoReactDraw = ["x", "y", "visible"];
  static readonly type: string = "Layer";

  public get canvas() {
    return this.#context.canvas;
  }
  // eslint-disable-next-line functional/prefer-readonly-type
  public loopCasting = false;
  // eslint-disable-next-line functional/prefer-readonly-type
  public currentNeedReload = true;

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  readonly #context = document.createElement("canvas").getContext("2d")!;
  // eslint-disable-next-line functional/prefer-readonly-type
  private waitDrawing = false;
  // eslint-disable-next-line functional/prefer-readonly-type
  private displayBp = "";
  // eslint-disable-next-line functional/prefer-readonly-type
  private idRequestFrame?: ReturnType<typeof requestAnimationFrame>;

  constructor(attrs: Attrs<Events> = {}) {
    super(
      attrs,
      () => {
        this.currentNeedReload = true;
      },
      Layer._attrNoReactDraw
    );

    this.#context.canvas.style.cssText =
      "position: absolute; margin: 0; padding: 0";

    this.watch(
      ["x", "y"],
      () => {
        this.canvas.style.left = (this.attrs.x ?? 0) + "px";
        this.canvas.style.top = (this.attrs.y ?? 0) + "px";
      },
      { immediate: true }
    );
    this.watch(
      ["width", "height"],
      () => {
        this.canvas.style.width = this.attrs.width
          ? `${this.attrs.width}px`
          : "100%";
        this.canvas.style.height = this.attrs.height
          ? `${this.attrs.height}px`
          : "100%";
        [this.canvas.width, this.canvas.height] = [
          this.canvas.scrollWidth,
          this.canvas.scrollHeight,
        ];
      },
      { immediate: true }
    );
    this.watch(
      "visible",
      () => {
        this.displayBp = this.canvas.style.display;
        const display = getComputedStyle(this.canvas).getPropertyValue(
          "display"
        );

        if (this.attrs.visible ?? true) {
          if (display === "none") {
            this.canvas.style.display = "block";
          } else {
            this.canvas.style.display =
              this.displayBp === "none" ? "" : this.displayBp;
          }

          return;
        }

        if (display === "none") {
          return;
        }

        this.canvas.style.display = "none";
      },
      { immediate: true }
    );
    this.watch(
      "id",
      () => {
        this.canvas.setAttribute("id", this.attrs.id ?? "");
      },
      { immediate: true }
    );
    this.watch(
      "name",
      () => {
        this.canvas.setAttribute("class", this.attrs.name ?? "");
      },
      { immediate: true }
    );

    EventsDefault.forEach((type) => {
      this.on(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        type as any,
        this.activatorEventChildren.bind(this)
      );
    });
  }

  private activatorEventChildren(
    event: EventsDefault[keyof EventsDefault]
  ): void {
    // eslint-disable-next-line functional/no-let
    let clients: readonly ReturnType<typeof realMousePosition>[];

    this.children.forEach((node) => {
      if (node.listeners.has(event.type)) {
        console.log(`active event ${event.type}`);
        if (!clients) {
          clients = (
            event.type.startsWith("touch")
              ? Array.from((event as TouchEvent).changedTouches)
              : [event as MouseEvent | WheelEvent]
          ).map((touch) =>
            realMousePosition(this.canvas, touch.clientX, touch.clientY)
          );
        }

        if (clients.some((item) => node.isPressedPoint(item.x, item.y))) {
          node.emit(event.type, event);
        }
      }
    });
  }

  public draw() {
    const needReload = this.currentNeedReload;
    if (needReload === false) {
      return;
    }

    const context = this.#context;

    if (this.attrs.clearBeforeDraw ?? true) {
      context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
    const needBackup = this.attrs.clip !== void 0;

    if (needBackup) {
      context.save();

      if (typeof this.attrs.clip === "function") {
        const path = new Path2D();
        this.attrs.clip.call(this, path);
        context.clip(path);
      } else {
        context.rect(
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          this.attrs.clip!.x,
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          this.attrs.clip!.y,
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          this.attrs.clip!.width,
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          this.attrs.clip!.height
        );
      }
    }
    const needUseTransform =
      this.attrs.scale !== void 0 ||
      this.attrs.rotation !== void 0 ||
      this.attrs.offset !== void 0 ||
      this.attrs.skewX !== void 0 ||
      this.attrs.skewY !== void 0 ||
      !context;
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

      context.setTransform(createTransform(this.attrs, !context));
    }
    if (useFilter) {
      backupFilter = context.filter;

      // eslint-disable-next-line functional/immutable-data, @typescript-eslint/no-non-null-assertion
      context.filter = createFilter(this.attrs.filter!);
    }

    this.children.forEach((node) => {
      node.draw(context);
    });

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
    if (needBackup) {
      context.restore();
    }

    this.currentNeedReload = false;
  }

  // @overwrite
  // eslint-disable-next-line functional/functional-parameters, functional/prefer-readonly-type
  public add(...nodes: Shape[]): void {
    super.add(...nodes);
    nodes.forEach((node) => node._onAddToLayer(this));
  }
  // eslint-disable-next-line functional/functional-parameters, functional/prefer-readonly-type
  public delete(...nodes: Shape[]): void {
    super.delete(...nodes);
    nodes.forEach((node) => node._onRemoveLayer(this));
  }

  public batchDraw() {
    this.loopCasting = true;
    if (!this.waitDrawing) {
      this.waitDrawing = true;
      this.idRequestFrame = requestAnimationFrame(() => {
        this.draw();
        this.waitDrawing = false;
        this.batchDraw();
      });
    }
  }
  public stopDraw() {
    if (!this.idRequestFrame) {
      return;
    }

    this.waitDrawing = true;
    cancelAnimationFrame(this.idRequestFrame);
    this.waitDrawing = false;
    this.loopCasting = false;
  }

  public on<Name extends keyof Events>(
    name: Name,
    callback: (this: this, event: Events[Name]) => void
  ): this {
    super.on(name, callback);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    this.canvas.addEventListener(name, callback as unknown as any);

    return this;
  }
  public off<Name extends keyof Events>(
    name: Name,
    callback?: (this: this, event: Events[Name]) => void
  ): this {
    if (callback) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      this.canvas.removeEventListener(name, callback as unknown as any);
    } else {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      this.listeners
        .get(name)!
        .forEach((cb) => this.canvas.removeEventListener(name, cb));
    }

    super.off(name, callback);

    return this;
  }

  public destroy(): void {
    this.stopDraw();
    this.children.forEach((node) => this.delete(node));
    this.listeners.forEach((_cbs, name) => this.off(name));
    super.destroy();
    this.canvas.remove();
  }
}
