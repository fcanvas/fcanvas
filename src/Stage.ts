import { AttrListening, AttrsIdentifitation, Container } from "./Container";
import { Layer } from "./Layer";
import { createTransform, OptionTransform } from "./helpers/createTransform";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Attrs<Events extends Record<string, any>> = {
  // eslint-disable-next-line functional/prefer-readonly-type
  width: number;
  // eslint-disable-next-line functional/prefer-readonly-type
  height: number;
  // eslint-disable-next-line functional/prefer-readonly-type
  container: string;
  // eslint-disable-next-line functional/prefer-readonly-type
  visible?: boolean;
  // eslint-disable-next-line functional/prefer-readonly-type
  opacity?: number;
} & OptionTransform &
  AttrsIdentifitation &
  AttrListening<Events>;

type Events = HTMLElementEventMap;

export class Stage extends Container<Attrs<Events>, Events, Layer> {
  static readonly type: string = "Stage";
  readonly #container = document.createElement("div");

  constructor(attrs: Attrs<Events>) {
    super(attrs);

    const el = document.getElementById(attrs.container);
    if (!el) {
      // eslint-disable-next-line functional/no-throw-statement
      throw new Error(`#${attrs.container} not exists.`);
    }

    this.#container.style.cssText = "position: relative;";

    this.watch(
      ["scale", "rotation", "offset", "skewX", "skewY"],
      () => {
        this.#container.style.transform = createTransform(
          this.attrs
        ).toString();
      },
      {
        immediate: true,
        deep: true,
      }
    );
    this.watch(
      ["width", "height"],
      () => {
        this.#container.style.width = `${this.attrs.width ?? 300}px`;
        this.#container.style.height = `${this.attrs.height ?? 300}px`;
      },
      {
        immediate: true,
      }
    );
    // eslint-disable-next-line functional/no-let
    let displayBp = "";
    this.watch(
      "visible",
      () => {
        displayBp = this.#container.style.display;
        const display = getComputedStyle(this.#container).getPropertyValue(
          "display"
        );

        if (this.attrs.visible ?? true) {
          if (display === "none") {
            this.#container.style.display = "block";
          } else {
            this.#container.style.display =
              displayBp === "none" ? "" : displayBp;
          }

          return;
        }

        if (display === "none") {
          return;
        }

        this.#container.style.display = "none";
      },
      {
        immediate: true,
      }
    );
    this.watch(
      "id",
      () => {
        this.#container.setAttribute("id", this.attrs.id ?? "");
      },
      {
        immediate: true,
      }
    );
    this.watch(
      "name",
      () => {
        this.#container.setAttribute("class", this.attrs.name ?? "");
      },
      {
        immediate: true,
      }
    );
    this.watch(
      "opacity",
      (val) => {
        this.#container.style.opacity = val + "";
      },
      {
        immediate: true,
      }
    );

    el.appendChild(this.#container);
  }

  // eslint-disable-next-line functional/functional-parameters, functional/prefer-readonly-type
  add(...layers: Layer[]) {
    super.add(...layers);
    this.children.forEach((layer) => {
      if (this.#container.contains(layer.canvas) === false) {
        this.#container.appendChild(layer.canvas);
      }
      
      if (globalConfigs.autoDrawEnabled) {
        layer.batchDraw();
      }
    });
  }
  // eslint-disable-next-line functional/functional-parameters, functional/prefer-readonly-type
  delete(...layers: Layer[]) {
    super.delete(...layers);
    layers.forEach((layer) => {
      layer.destroy();
    });
  }

  public on<Name extends keyof Events>(
    name: Name,
    callback: (this: this, event: Events[Name]) => void
  ): this {
    super.on(name, callback);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    this.#container.addEventListener(name, callback as unknown as any);

    return this;
  }
  public off<Name extends keyof Events>(
    name: Name,
    callback?: (this: this, event: Events[Name]) => void
  ): this {
    if (callback) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      this.#container.removeEventListener(name, callback as unknown as any);
    } else {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      this.listeners
        .get(name)!
        .forEach((cb) => this.#container.removeEventListener(name, cb));
    }

    super.off(name, callback);

    return this;
  }

  public destroy(): void {
    this.listeners.forEach((_cbs, name) => this.off(name));
    super.destroy();
    this.#container.remove();
  }
}
