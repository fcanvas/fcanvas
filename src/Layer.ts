import { Container } from "./Container";
import { EventsDefault, Shape } from "./Shape";
import { realMousePosition } from "./helpers/realMousePosition";
import { Offset} from "./types/Offset"
import { OptionTransform, createTransform } from "./helpers/createTransform"
import { OptionFilter, createFilter } from "./helpers/createFilter"
import { createProxy } from "./helpers/createProxy";

type Attrs = Partial<Offset> & {
  // eslint-disable-next-line functional/prefer-readonly-type
  clearBeforeDraw?: boolean;
  width?: number;
  height?: number;
  visible?: boolean
  listening?: Map<string, Array<(event: any) => void>>
  id?: string;
  name?: string;
  opacity?: number;
  clip?: Offset & {
    width: number
    height: number
  } | ((this: Layer, context: Path2D) => void);
} & OptionTransform & {
  filter?: OptionTransform
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class Layer extends Container<Shape<any, any>> {
  readonly type = "Layer";
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  readonly #context = document.createElement("canvas").getContext("2d")!;

  get canvas() {
    return this.#context.canvas;
  }
  private currentNeedReload = true

  readonly attrs: Attrs;
  private reactOffset() : void {
    this.canvas.style.left = (this.attrs.x ?? 0) + "px"
    this.canvas.style.top = (this.attrs.y ?? 0) + "px"
  }
  private reactSize() : void {
    this.canvas.style.width = this.attrs.width ? `${this.attrs.width}px` : "100%"
    this.canvas.style.height = this.attrs.height ? `${this.attrs.height}px` : "100%"

    ;[this.canvas.width, this.canvas.height] = [this.canvas.scrollWidth, this.canvas.scrollHeight]
  }
  private displayBp = ""
  private reactVisible() : void {
    this.displayBp = this.canvas.style.display
    const display = getComputedStyle(this.canvas).getPropertyValue("display")

    if (this.attrs.visible ?? true) {
      if (display === "none") {
        this.canvas.style.display = "block"
      } else {
        this.canvas.style.display = this.displayBp === "none" ? "" : this.displayBp
      }

      return
    }

    if (display === "none") {
      return
    }
    this.canvas.style.display = "none"
  }
  private reactId() : void {
    this.canvas.setAttribute("id", this.attrs.id ?? "")
  }
  private reactName() : void {
    this.canvas.setAttribute("class", this.attrs.name ?? "")
  }

  constructor(attrs: Attrs = {}) {
    super();

    this.reactOffset()
    this.reactSize()
    this.reactVisible()
    this.reactId()
    this.reactName()
    this.attrs = createProxy(attrs, prop => {
      if (prop === "x" || prop === "y") {
        this.reactOffset()
        return
      }
      if (prop === "width" || prop === "height") {
        this.reactSize()
        return
      }
      if (prop === "visible") {
        this.reactVisible()
        return
      }
      if (prop === "id") {
        this.reactId()
        return
      }
      if (prop === "name") {
        this.reactName()
        return
      }

      this.currentNeedReload = true
    });
    EventsDefault.forEach((type) => {
      this.canvas.addEventListener(
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

  public matches() {
    return false;
  }

  private _draw() {
    const needReload = this.currentNeedReload || Array.from(this.children).some(node => {
      node.parentNeedReloading = false;
      return node.parentNeedReloading
    })

    if (needReload === false) {
      return
    }
    
    const context = this.#context

    if (this.attrs.clearBeforeDraw ?? true) {
      context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
    const needBackup = this.attrs.clip !== void 0

    if (needBackup) {
      context.save()

      if (typeof this.attrs.clip === "function") {
        const path = new Path2D()
        this.attrs.clip.call(this, path)
        context.clip(path)
      } else {
        context.rect(this.attrs.clip!.x, this.attrs.clip!.y, this.attrs.clip!.width, this.attrs.clip!.height)
      }
    }
    const needUseTransform =
      this.attrs.scale !== void 0 ||
      this.attrs.rotation !== void 0 ||
      this.attrs.offset !== void 0 ||
      this.attrs.skewX !== void 0 ||
      this.attrs.skewY !== void 0 ||
      !context
    const needSetAlpha = this.attrs.opacity !== void 0;
    const useFilter = this.attrs.filter !== void 0
    // eslint-disable-next-line functional/no-let
    let backupTransform, backupAlpha: number, backupFilter: string;;

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
      backupFilter = context.filter

      context.filter = createFilter(this.attrs.filter!) 
    }

    this.children.forEach((node) => {
      node.draw(context);
    });

    if (useFilter) {
      // eslint-disable-next-line functional/immutable-data, @typescript-eslint/no-non-null-assertion
      context.filter = backupFilter!
    }
    if (needUseTransform) {
      context.setTransform(backupTransform);
    }
    if (needSetAlpha) {
      // eslint-disable-next-line functional/immutable-data, @typescript-eslint/no-non-null-assertion
      context.globalAlpha = backupAlpha!;
    }
    if (needBackup) {
      context.restore()
    }

    this.currentNeedReload = false
  }

  draw() {
    this._draw();
  }
}
