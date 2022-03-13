import { Container } from "./Container";
import { Layer } from "./Layer";

type Attrs = {
  // eslint-disable-next-line functional/prefer-readonly-type
  width: number;
  // eslint-disable-next-line functional/prefer-readonly-type
  height: number;
  // eslint-disable-next-line functional/prefer-readonly-type
  container: string;
};
export class Stage extends Container<Layer> {
  readonly type = "Stage";
  readonly #attrs: Attrs;
  readonly container: HTMLElement;

  constructor(attrs: Attrs) {
    super();
    this.#attrs = attrs;
    const el = document.getElementById(attrs.container);
    if (!el) {
      // eslint-disable-next-line functional/no-throw-statement
      throw new Error(`#${attrs.container} not exists.`);
    }

    this.container = el;
  }
  add() {
    // eslint-disable-next-line functional/functional-parameters, prefer-rest-params
    super.add(...arguments);
    this.children.forEach((layer) => {
      if (this.container.contains(layer.canvas) === false) {
        this.container.appendChild(layer.canvas);
      }

      layer.batchDraw();
    });
  }
}
