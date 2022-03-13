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
// eslint-disable-next-line @typescript-eslint/ban-types
type Events = {};

export class Stage extends Container<Attrs, Events, Layer> {
  readonly type = "Stage";
  readonly #attrs: Attrs;
  readonly container: HTMLElement;

  constructor(attrs: Attrs) {
    super(attrs);
    this.#attrs = attrs;
    const el = document.getElementById(attrs.container);
    if (!el) {
      // eslint-disable-next-line functional/no-throw-statement
      throw new Error(`#${attrs.container} not exists.`);
    }

    this.container = el;
  }
  // eslint-disable-next-line functional/functional-parameters, functional/prefer-readonly-type
  add(...layers: Layer[]) {
    super.add(...layers);
    this.children.forEach((layer) => {
      if (this.container.contains(layer.canvas) === false) {
        this.container.appendChild(layer.canvas);
      }

      layer.batchDraw();
    });
  }
  // eslint-disable-next-line functional/functional-parameters, functional/prefer-readonly-type
  delete(...layers: Layer[]) {
    super.delete(...layers);
    layers.forEach((layer) => {
      layer.destroy();
    });
  }
}
