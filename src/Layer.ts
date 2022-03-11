
import { keys } from "ts-transformer-keys"

import { Container } from "./Container";
import { EventsDefault, Shape } from "./Shape";
import { realMousePosition } from "./helpers/realMousePosition"

type Attrs = {
  // eslint-disable-next-line functional/prefer-readonly-type
  clearBeforeDraw?: boolean;
};

const EventsDefault = keys<EventsDefault>()
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class Layer extends Container<Shape<any, any>> {
  readonly type = "Layer";
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  readonly #context = document.createElement("canvas").getContext("2d")!;

  get canvas() {
    return this.#context.canvas;
  }

  readonly #attrs: Attrs;
  constructor(attrs: Attrs = {}) {
    super();

    this.#attrs = attrs;
    EventsDefault.forEach(type => {
        this.canvas.addEventListener(type as any, this.activatorEventChildren.bind(this))
    })
  }
  private activatorEventChildren(event : EventsDefault[keyof EventsDefault]) : void {
      // eslint-disable-next-line functional/no-let
      let clients: readonly ReturnType< typeof realMousePosition>[]

      this.children.forEach(node => {
          if (node.listeners.has(event.type)) {
              console.log(`active event ${event.type}`)
              if (!clients) {
                  clients = (event.type.startsWith("touch") ? Array.from((event as TouchEvent).changedTouches) : [event as MouseEvent | WheelEvent ]).map(touch => realMousePosition(this.canvas, touch.clientX, touch.clientY))
              }
              
              if (clients.some(item => node.isPressedPoint(item.x, item.y))) {
                  node.emit(event.type, event)
              }
          }
      })
  }

  public matches() {
    return false;
  }

  private _draw() {
    if (this.#attrs.clearBeforeDraw ?? true) {
      this.#context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
    this.children.forEach((node) => {
      node.draw(this.#context);
    });
  }

  draw() {
    this._draw();
  }
}
