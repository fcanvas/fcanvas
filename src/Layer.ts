
import { Container } from "./Container";
import { Shape } from "./Shape";
import { realMousePosition } from "./helpers/realMousePosition"

type Attrs = {
  // eslint-disable-next-line functional/prefer-readonly-type
  clearBeforeDraw?: boolean;
};
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
    this.canvas.addEventListener("mousedown", event => {
        const { x: clientX, y: clientY } =  realMousePosition(this.canvas, event.clientX, event.clientY)

        this.children.forEach(node => {
            if (node.listeners.has("mousedown")) {
                console.log("active event")
                if (node.isPressedPoint(clientX, clientY)) {
                    node.emit("mousedown", event)
                }
            }
        })
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
