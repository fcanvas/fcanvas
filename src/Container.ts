import { Utils } from "./Utils";
import { createProxy } from "./helpers/createProxy";
import { realMousePosition } from "./helpers/realMousePosition";
import { Offset } from "./types/Offset";
import { Size } from "./types/Size";
import { loadImage } from "./utils/loadImage";

type AttrsIdentifitation = {
  // eslint-disable-next-line functional/prefer-readonly-type
  id?: string;
  // eslint-disable-next-line functional/prefer-readonly-type
  name?: string;
};

type EventsDefault = {
  /* @mouse event */
  // eslint-disable-next-line functional/prefer-readonly-type
  mouseover: MouseEvent;
  // eslint-disable-next-line functional/prefer-readonly-type
  mouseout: MouseEvent;
  // eslint-disable-next-line functional/prefer-readonly-type
  mouseenter: MouseEvent;
  // eslint-disable-next-line functional/prefer-readonly-type
  mouseleave: MouseEvent;
  // eslint-disable-next-line functional/prefer-readonly-type
  mousemove: MouseEvent;
  // eslint-disable-next-line functional/prefer-readonly-type
  mousedown: MouseEvent;
  // eslint-disable-next-line functional/prefer-readonly-type
  mouseup: MouseEvent;
  // eslint-disable-next-line functional/prefer-readonly-type
  wheel: WheelEvent;
  // eslint-disable-next-line functional/prefer-readonly-type
  click: MouseEvent;
  // eslint-disable-next-line functional/prefer-readonly-type
  dblclick: MouseEvent;

  /* touch event */
  // eslint-disable-next-line functional/prefer-readonly-type
  touchstart: TouchEvent;
  // eslint-disable-next-line functional/prefer-readonly-type
  touchmove: TouchEvent;
  // eslint-disable-next-line functional/prefer-readonly-type
  touchend: TouchEvent;
  // eslint-disable-next-line functional/prefer-readonly-type
  tap: TouchEvent;
  // eslint-disable-next-line functional/prefer-readonly-type
  dbltap: TouchEvent;
};
export type EventsSelf<EventsCustom> = EventsDefault & EventsCustom;
type AttrListening = {
  // eslint-disable-next-line functional/prefer-readonly-type
  listening?: // eslint-disable-next-line functional/prefer-readonly-type
  | Map<
        keyof EventsDefault | string,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any, functional/prefer-readonly-type
        Array<(event: any) => void>
      >
    | false;
};

type AttrsDefault = AttrsIdentifitation & AttrListening;
export type AttrsSelf<
  AttrsCustom,
  AttrsRefs extends Record<string, unknown>,
  AttrsRaws extends Record<string, unknown>
> = AttrsDefault &
  AttrsCustom & {
    // eslint-disable-next-line functional/prefer-readonly-type
    refs?: AttrsRefs;
    // eslint-disable-next-line functional/prefer-readonly-type
    raws?: AttrsRaws;
  };
type NotNillRefsRaws<
  AttrsCustom,
  AttrsRefs extends Record<string, unknown>,
  AttrsRaws extends Record<string, unknown>
> = AttrsSelf<AttrsCustom, AttrsRefs, AttrsRaws> &
  Required<Pick<AttrsSelf<AttrsCustom, AttrsRefs, AttrsRaws>, "raws" | "refs">>;
type CallbackWatcher<T> = (
  newValue: T,
  oldValue: T,
  prop: string
) => void | Promise<void>;
type OptionsWatcher = {
  // eslint-disable-next-line functional/prefer-readonly-type
  immediate?: boolean;
  // eslint-disable-next-line functional/prefer-readonly-type
  deep?: boolean;
};
export declare class VirualParentNode {
  // eslint-disable-next-line functional/prefer-readonly-type, @typescript-eslint/no-explicit-any
  add(...nodes: any[]): void;
  // eslint-disable-next-line functional/prefer-readonly-type, @typescript-eslint/no-explicit-any
  delete(...nodes: any[]): void;
}

export declare class VirualChildNode {
  matches(selector: string): boolean;
  _onAddToParent(parent: VirualParentNode): void;
  _onDeleteParent(parent: VirualParentNode): void;
  // eslint-disable-next-line functional/prefer-readonly-type
  readonly listeners?: Map<
    unknown,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, functional/prefer-readonly-type
    Array<(event: any) => void>
  >;

  public isPressedPoint?(x: number, y: number, event?: Event): boolean;

  // eslint-disable-next-line functional/prefer-readonly-type, @typescript-eslint/ban-types
  emit: Function;
}

abstract class ContainerBasic<
  AttrsCustom extends Record<string, unknown>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  EventsCustom extends Record<string, any>,
  AttrsRefs extends Record<string, unknown>,
  AttrsRaws extends Record<string, unknown>
> {
  static readonly raws = ["id", "name", "listeners", "raws"];
  static readonly type: string;

  public get type(): string {
    return (
      (this.constructor as unknown as typeof ContainerNode).type ?? "unknown"
    );
  }
  public get id(): string | null {
    return this.attrs.id ?? null;
  }
  public get name(): string {
    return this.attrs.name ?? "";
  }
  public readonly attrs: NotNillRefsRaws<AttrsCustom, AttrsRefs, AttrsRaws>;
  public readonly _: NotNillRefsRaws<AttrsCustom, AttrsRefs, AttrsRaws>;
  public get raws(): AttrsRaws {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return this.attrs.raws!;
  }
  public get refs(): AttrsRefs {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return this.attrs.refs!;
  }
  // eslint-disable-next-line functional/prefer-readonly-type
  public readonly listeners?: Map<
    keyof EventsSelf<EventsCustom> | string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, functional/prefer-readonly-type
    Array<(event: any) => void>
  >;
  public readonly watchers = new Map<
    string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, functional/prefer-readonly-type
    Map<CallbackWatcher<any>, boolean>
  >();

  constructor(
    attrs: AttrsSelf<AttrsCustom, AttrsRefs, AttrsRaws>,
    onNeedUpdate?: (
      prop: keyof AttrsSelf<AttrsCustom, AttrsRefs, AttrsRaws>
    ) => void,
    // eslint-disable-next-line functional/prefer-readonly-type
    attrNoReactDraw?: string[]
  ) {
    if (attrs.listening !== false) {
      this.listeners = new Map<
        keyof EventsSelf<EventsCustom> | string,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any, functional/prefer-readonly-type
        Array<(event: any) => void>
      >();
    }
    this.attrs = createProxy(attrs, (prop, newVal, oldVal) => {
      this.watchers.forEach((listeners, selfProp) => {
        if (selfProp === "*") return;

        if (prop === selfProp) {
          listeners.forEach((_val, cb) => {
            (
              cb as CallbackWatcher<
                AttrsSelf<AttrsCustom, AttrsRefs, AttrsRaws>[typeof prop]
              >
            )(newVal, oldVal, prop);
          });
          return;
        }

        if ((prop as string).startsWith(`${selfProp as string}.`)) {
          listeners.forEach((deep, cb) => {
            if (deep) {
              (
                cb as CallbackWatcher<
                  AttrsSelf<AttrsCustom, AttrsRefs, AttrsRaws>[typeof prop]
                >
              )(newVal, oldVal, prop);
            }
          });
        }
      });
      this.watchers.get("*")?.forEach((_deep, cb) =>
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (cb as CallbackWatcher<any>)(newVal, oldVal, prop)
      );

      if (
        !ContainerNode.raws.includes(prop as string) &&
        !attrNoReactDraw?.includes(prop as string)
      ) {
        onNeedUpdate?.(prop);
      }
    }) as NotNillRefsRaws<AttrsCustom, AttrsRefs, AttrsRaws>;
    this._ = this.attrs;

    if (this.attrs.listening !== false) {
      this.attrs.listening?.forEach((cbs, name) => {
        cbs.forEach((cb) => this.on(name, cb));
      });
    }
  }

  public matches(selector: string): boolean {
    return selector.split(",").some((sel) => {
      const [other, id] = sel.trim().split("#");

      const [tag, ...classes] = other.split(".");

      const validTag =
        tag === "" || tag?.toLowerCase() === this.type?.toLowerCase();
      const validClass =
        classes.length === 0
          ? true
          : classes.every((clazz) =>
              new RegExp(`(^| )${clazz}( |$)`).test(this.name)
            );
      const validId = id ? id === this.id : true;

      return validTag && validClass && validId;
    });
  }

  public on<Name extends keyof EventsSelf<EventsCustom>>(
    name: Name,
    callback: (this: this, event: EventsSelf<EventsCustom>[Name]) => void
  ): this;
  public on(name: string, callback: (this: this, event: Event) => void): this;
  public on(
    name: string | keyof EventsSelf<EventsCustom>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    callback: (event: any) => void
  ) {
    if (this.listeners) {
      const listeners = this.listeners.get(name);
      if (listeners) {
        // eslint-disable-next-line functional/immutable-data
        listeners.push(callback);
      } else {
        this.listeners.set(name, [callback]);
      }
    }

    return this;
  }
  public off<Name extends keyof EventsSelf<EventsCustom>>(
    name: Name,
    callback?: (this: this, event: EventsSelf<EventsCustom>[Name]) => void
  ): this;
  public off(name: string, callback?: (this: this, event: Event) => void): this;
  public off(
    name: string | keyof EventsSelf<EventsCustom>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    callback?: (event: any) => void
  ): this {
    if (this.listeners) {
      const listeners = this.listeners.get(name);

      if (callback) {
        // eslint-disable-next-line functional/immutable-data
        listeners?.splice(listeners.indexOf(callback) >>> 0, 1);
      } else {
        // eslint-disable-next-line functional/immutable-data
        listeners?.splice(0);
      }
    }

    return this;
  }
  public emit<Name extends keyof EventsSelf<EventsCustom>>(
    name: Name,
    event: EventsSelf<EventsCustom>[Name]
  ): this;
  public emit(name: string, event: Event): this;
  public emit(
    name: string | keyof EventsSelf<EventsCustom>,
    event: Event
  ): this {
    if (this.listeners) {
      this.listeners.get(name)?.forEach((cb) => {
        cb.call(this, event);
      });
    }

    return this;
  }

  public watch(
    prop: "*",
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    cb: CallbackWatcher<any>,
    options?: Omit<OptionsWatcher, "immediate">
  ): () => void;
  public watch<
    K extends string & keyof AttrsSelf<AttrsCustom, AttrsRefs, AttrsRaws>
  >(
    prop: K,
    cb: CallbackWatcher<AttrsSelf<AttrsCustom, AttrsRefs, AttrsRaws>[K]>,
    options?: OptionsWatcher
  ): () => void;
  public watch<
    K extends string & keyof AttrsSelf<AttrsCustom, AttrsRefs, AttrsRaws>,
    // eslint-disable-next-line functional/prefer-readonly-type
    KS extends K[]
  >(
    prop: KS,
    cb: CallbackWatcher<
      K extends keyof AttrsSelf<AttrsCustom, AttrsRefs, AttrsRaws>
        ? AttrsSelf<AttrsCustom, AttrsRefs, AttrsRaws>[K]
        : // eslint-disable-next-line @typescript-eslint/no-explicit-any
          any
    >,
    options?: OptionsWatcher
  ): () => void;
  public watch(
    // eslint-disable-next-line functional/prefer-readonly-type
    prop: string | string[],
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    cb: CallbackWatcher<any>,
    options?: OptionsWatcher | Omit<OptionsWatcher, "immediate">
  ): () => void {
    if (!Array.isArray(prop)) {
      // eslint-disable-next-line functional/prefer-readonly-type
      prop = [prop] as string[];
    }

    prop.forEach((prop) => {
      if (this.watchers.has(prop) === false) {
        this.watchers.set(prop, new Map());
      }

      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion, @typescript-eslint/no-explicit-any
      this.watchers.get(prop)!.set(cb as any, options?.deep ?? false);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if ((options as any)?.immediate) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const val = this.attrs[prop] as unknown as any;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (cb as CallbackWatcher<any>)(val, val, prop);
      }
    });

    return () =>
      (prop as readonly string[]).forEach((prop) =>
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion, @typescript-eslint/no-explicit-any
        this.watchers.get(prop)!.delete(cb as any)
      );
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public toObject(): any {
    return JSON.parse(
      JSON.stringify({
        type: this.type,
        attrs: this.attrs,
      })
    );
  }
  public toJSON() {
    return JSON.stringify(this.toObject());
  }
  public clone(): this {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return new (this.constructor as unknown as any)(this.attrs);
  }
  public toCanvas(
    config?: Partial<Offset> &
      Partial<Size> & {
        // eslint-disable-next-line functional/prefer-readonly-type
        pixelRatio?: number;
      }
  ): HTMLCanvasElement {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((this as any).canvas && !config) return (this as any).canvas;

    const canvas = Utils.createCanvas();
    [canvas.width, canvas.height] = [
      config?.width ?? 300,
      config?.height ?? 300,
    ];
    // eslint-disable-next-line functional/no-let
    let pixelRatioBk: number | void;

    if (config?.pixelRatio !== void 0) {
      pixelRatioBk = window.devicePixelRatio;
      // eslint-disable-next-line functional/immutable-data
      window.devicePixelRatio = config.pixelRatio;
    }

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const ctx = canvas.getContext("2d")!;
    ctx.translate(config?.x ?? 0, config?.y ?? 0);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((this as any).canvas) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ctx.drawImage((this as any).canvas, 0, 0);
    } else {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (this as any).draw(ctx);
    }

    if (pixelRatioBk !== void 0) {
      // eslint-disable-next-line functional/immutable-data
      window.devicePixelRatio = pixelRatioBk;
    }
    return canvas;
  }
  public toDataURL(type?: string, quality?: number): string {
    return this.toCanvas().toDataURL(type, quality);
  }
  public toImage(
    config?: Partial<Offset> &
      Partial<Size> & {
        // eslint-disable-next-line functional/prefer-readonly-type
        pixelRatio?: number;
        // eslint-disable-next-line functional/prefer-readonly-type
        type?: string;
        // eslint-disable-next-line functional/prefer-readonly-type
        quality?: number;
      }
  ): Promise<HTMLImageElement> {
    return loadImage(
      this.toCanvas(config).toDataURL(config?.type, config?.quality)
    );
  }

  public destroy(): void {
    this.listeners?.clear();
    this.watchers.clear();
  }
}

export abstract class ContainerNode<
    AttrsCustom extends Record<string, unknown>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    EventsCustom extends Record<string, any>,
    IParentNode extends VirualParentNode,
    AttrsRefs extends Record<string, unknown>,
    AttrsRaws extends Record<string, unknown>
  >
  extends ContainerBasic<AttrsCustom, EventsCustom, AttrsRefs, AttrsRaws>
  implements VirualChildNode
{
  static readonly raws = ["id", "name", "listeners"];
  static readonly type: string = "ContainerNode";
  public readonly parents = new Set<IParentNode>();
  // eslint-disable-next-line functional/prefer-readonly-type, @typescript-eslint/no-inferrable-types
  public currentNeedReload: boolean = true;

  public _onAddToParent(parent: IParentNode): void {
    this.parents.add(parent);
  }
  public _onDeleteParent(parent: IParentNode): void {
    this.parents.delete(parent);
  }

  public moveTo(parent: IParentNode): void {
    this.remove();
    parent.add(this);
  }

  public remove(): void {
    this.parents.forEach((parent) => {
      parent.delete(this);
    });
  }
}

export abstract class Container<
    AttrsCustom extends Record<string, unknown> & AttrsIdentifitation,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    EventsCustom extends Record<string, any>,
    IChildNode extends VirualChildNode,
    AttrsRefs extends Record<string, unknown>,
    AttrsRaws extends Record<string, unknown>
  >
  extends ContainerBasic<AttrsCustom, EventsCustom, AttrsRefs, AttrsRaws>
  implements VirualParentNode
{
  static readonly type: string = "Container";
  public readonly children = new Set<IChildNode>();
  // eslint-disable-next-line functional/prefer-readonly-type, @typescript-eslint/no-inferrable-types
  public currentNeedReload: boolean = true;

  // eslint-disable-next-line functional/prefer-readonly-type
  public find<T = IChildNode>(selector: string): T[] {
    // eslint-disable-next-line functional/prefer-readonly-type
    const els: T[] = [];

    this.children.forEach((el) => {
      if (el.matches(selector)) {
        // eslint-disable-next-line functional/immutable-data
        els.push(el as unknown as T);
      }
      if (el instanceof Container) {
        // eslint-disable-next-line functional/immutable-data
        els.push(...el.find(selector));
      }
    });

    return els;
  }
  public findOne<T = IChildNode>(selector: string): T | null {
    // eslint-disable-next-line functional/no-let
    let el: T | null = null;

    // eslint-disable-next-line functional/no-loop-statement
    for (const i of this.children) {
      if (i.matches(selector)) {
        el = i as unknown as T;
      } else if (i instanceof Container) {
        el = i.findOne(selector);
      }

      if (el) break;
    }

    return el;
  }

  // eslint-disable-next-line functional/functional-parameters, functional/prefer-readonly-type
  public add(...nodes: IChildNode[]): void {
    nodes.forEach((node) => {
      this.children.add(node);
      node._onAddToParent(this);
    });
    this.currentNeedReload = true;
  }
  // eslint-disable-next-line functional/functional-parameters, functional/prefer-readonly-type
  public delete(...nodes: IChildNode[]): void {
    nodes.forEach((node) => {
      this.children.delete(node);
      node._onDeleteParent(this);
    });
    this.currentNeedReload = true;
  }

  protected nodeHaveInClients(
    node: IChildNode,
    clients: readonly ReturnType<typeof realMousePosition>[],
    event: Event
  ): boolean {
    return clients.some((item) => node.isPressedPoint?.(item.x, item.y, event));
  }
  protected fireChild(event: Event, target?: HTMLCanvasElement): void {
    // eslint-disable-next-line functional/no-let
    let clients: readonly ReturnType<typeof realMousePosition>[];

    this.children.forEach((node) => {
      if (node.listeners?.has(event.type)) {
        if (!clients) {
          clients = (
            event.type.startsWith("touch")
              ? Array.from((event as TouchEvent).changedTouches)
              : [event as MouseEvent | WheelEvent]
          ).map((touch) =>
            realMousePosition(
              (event.target ||
                event.currentTarget ||
                target) as HTMLCanvasElement,
              touch.clientX,
              touch.clientY
            )
          );
        }

        if (this.nodeHaveInClients(node, clients, event)) {
          node.emit(event.type, event);
        }
      }
    });
  }

  public destroy(): void {
    super.destroy();
    this.children.clear();
  }
}
