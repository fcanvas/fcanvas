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
  get container() {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return document.getElementById(this.#attrs.container)!;
  }

  constructor(attrs: Attrs) {
    super();
    this.#attrs = attrs;
  }
  add() {
    // eslint-disable-next-line functional/functional-parameters, prefer-rest-params
    super.add(...arguments);
    this.children.forEach((layer) => {
      if (this.container.contains(layer.canvas) === false) {
        this.container.appendChild(layer.canvas);
      }
    });
    // eslint-disable-next-line functional/immutable-data
    this.container.innerHTML = "";
  }
}
