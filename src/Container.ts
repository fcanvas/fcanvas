import { createProxy } from "./helpers/createProxy";

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
export type AttrsSelf<AttrsCustom> = AttrsDefault & AttrsCustom;
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

export abstract class ContainerBasic<
  AttrsCustom extends Record<string, unknown>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  EventsCustom extends Record<string, any>,
  Attrs extends AttrsSelf<AttrsCustom> = AttrsSelf<AttrsCustom>,
  Events extends EventsSelf<EventsCustom> = EventsSelf<EventsCustom>
> {
  static readonly _attrNoReactDrawDefault = ["id", "name", "listeners"];
  static readonly type: string;

  public get type(): string {
    return (this.constructor as typeof ContainerNode).type ?? "unknown";
  }
  public get id(): string | null {
    return this.attrs.id ?? null;
  }
  public get name(): string {
    return this.attrs.name ?? "";
  }
  public readonly attrs: Attrs;
  // eslint-disable-next-line functional/prefer-readonly-type
  public readonly listeners?: Map<
    keyof Events | string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, functional/prefer-readonly-type
    Array<(event: any) => void>
  >;
  public readonly watchers = new Map<
    string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, functional/prefer-readonly-type
    Map<CallbackWatcher<any>, boolean>
  >();

  constructor(
    attrs: Attrs,
    onNeedUpdate?: (prop: keyof Attrs) => void,
    // eslint-disable-next-line functional/prefer-readonly-type
    attrNoReactDraw?: string[]
  ) {
    if (attrs.listening !== false) {
      this.listeners = new Map<
        keyof Events | string,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any, functional/prefer-readonly-type
        Array<(event: any) => void>
      >();
    }
    this.attrs = createProxy(attrs, (prop, newVal, oldVal) => {
      this.watchers.forEach((listeners, selfProp) => {
        if (selfProp === "*") return;

        if (prop === selfProp) {
          listeners.forEach((_val, cb) => {
            (cb as CallbackWatcher<Attrs[typeof prop]>)(
              newVal,
              oldVal,
              prop
            );
          });
          return;
        }

        if ((prop as string).startsWith(`${selfProp as string}.`)) {
          listeners.forEach((deep, cb) => {
            if (deep) {
              (cb as CallbackWatcher<Attrs[typeof prop]>)(
                newVal,
                oldVal,
                prop + ""
              );
            }
          });
        }
      });
      this.watchers.get("*")?.forEach((_deep, cb) =>
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (cb as CallbackWatcher<any>)(newVal, oldVal, prop + "")
      );

      if (
        !ContainerNode._attrNoReactDrawDefault.includes(prop as string) &&
        !attrNoReactDraw?.includes(prop as string)
      ) {
        onNeedUpdate?.(prop);
      }
    });

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

  public on<Name extends keyof Events>(
    name: Name,
    callback: (this: this, event: Events[Name]) => void
  ): this;
  public on(name: string, callback: (this: this, event: Event) => void): this;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public on(name: string | keyof Events, callback: (event: any) => void) {
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
  public off<Name extends keyof Events>(
    name: Name,
    callback?: (this: this, event: Events[Name]) => void
  ): this;
  public off(name: string, callback?: (this: this, event: Event) => void): this;
  public off(
    name: string | keyof Events,
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
  public emit<Name extends keyof Events>(name: Name, event: Events[Name]): this;
  public emit(name: string, event: Event): this;
  public emit(name: string | keyof Events, event: Event): this {
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
  public watch<K extends keyof Attrs>(
    prop: K,
    cb: CallbackWatcher<Attrs[K]>,
    options?: OptionsWatcher
  ): () => void;
  // eslint-disable-next-line functional/prefer-readonly-type
  public watch<K extends keyof Attrs, KS extends K[]>(
    prop: KS,
    cb: CallbackWatcher<Attrs[K]>,
    options?: OptionsWatcher
  ): () => void;
  public watch<K extends keyof Attrs>(
    // eslint-disable-next-line functional/prefer-readonly-type
    prop: K | K[] | "*",
    cb: CallbackWatcher<Attrs[K]>,
    options?: OptionsWatcher | Omit<OptionsWatcher, "immediate">
  ): () => void {
    if (!Array.isArray(prop)) {
      // eslint-disable-next-line functional/prefer-readonly-type
      prop = [prop] as K[];
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
        (cb as CallbackWatcher<Attrs[K]>)(val, val, prop);
      }
    });

    return () =>
      (prop as readonly K[]).forEach((prop) =>
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion, @typescript-eslint/no-explicit-any
        this.watchers.get(prop)!.delete(cb as any)
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
    IParentNode extends VirualParentNode = VirualParentNode
  >
  extends ContainerBasic<AttrsCustom, EventsCustom>
  implements VirualChildNode
{
  static readonly _attrNoReactDrawDefault = ["id", "name", "listeners"];
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
}

export declare class VirualChildNode {
  matches(selector: string): boolean;
  _onAddToParent(parent: VirualParentNode): void;
  _onDeleteParent(parent: VirualParentNode): void;
}
export abstract class Container<
    AttrsCustom extends Record<string, unknown> & AttrsIdentifitation,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    EventsCustom extends Record<string, any>,
    IChildNode extends VirualChildNode
  >
  extends ContainerBasic<AttrsCustom, EventsCustom>
  implements VirualParentNode
{
  static readonly type: string = "Container";
  public readonly children = new Set<IChildNode>();
  // eslint-disable-next-line functional/prefer-readonly-type, @typescript-eslint/no-inferrable-types
  public currentNeedReload: boolean = true;

  // eslint-disable-next-line functional/prefer-readonly-type
  public find<T = IChildNode>(selector: string): T[] {
    return Array.from(this.children).filter(
      (item) => item.matches(selector)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ) as any;
  }

  // eslint-disable-next-line functional/functional-parameters, functional/prefer-readonly-type
  public add(...nodes: IChildNode[]): void {
    nodes.forEach((node) => {
      this.children.add(node);
      node._onAddToParent(this);
    });
    this.currentNeedReload = true;
  }
  // eslint-disable-next-line functional/functional-parameters
  public delete(...nodes: readonly IChildNode[]): void {
    nodes.forEach((node) => {
      this.children.delete(node);
      node._onDeleteParent(this);
    });
    this.currentNeedReload = true;
  }

  public destroy(): void {
    super.destroy();
    this.children.clear();
  }
}
