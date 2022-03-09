import { Container } from "./Container";
import { Shape } from "./Shape";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class Layer extends Container<Shape<any, any>> {
  readonly type = "Layer";
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  readonly #context = document.createElement("canvas").getContext("2d")!;

  get canvas() {
    return this.#context.canvas;
  }

  public matches() {
    return false;
  }

  draw() {
    this.children.forEach((node) => {
      node.draw(this.#context);
    });
  }
}
