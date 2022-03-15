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
  listening?: Map<
    keyof EventsDefault | string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, functional/prefer-readonly-type
    Array<(event: any) => void>
  >;
};

type AttrsDefault = AttrsIdentifitation & AttrListening;
export type AttrsSelf<AttrsCustom> = AttrsDefault & AttrsCustom;
type CallbackWatcher<T> = (newValue: T, oldValue: T) => void | Promise<void>;
type CallbackWatcherAll<P, T> = (
  prop: P,
  newValue: T,
  oldValue: T
) => void | Promise<void>;
type OptionsWatcher = {
  // eslint-disable-next-line functional/prefer-readonly-type
  immediate?: boolean;
  // eslint-disable-next-line functional/prefer-readonly-type
  deep?: boolean;
};
export abstract class ContainerNode<
  // eslint-disable-next-line @typescript-eslint/ban-types
  AttrsCustom extends Record<string, unknown> = {},
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
  EventsCustom extends Record<string, any> = {},
  Attrs extends AttrsSelf<AttrsCustom> = AttrsSelf<AttrsCustom>,
  Events extends EventsSelf<EventsCustom> = EventsSelf<EventsCustom>
> {
  static readonly _attrNoReactDrawDefault = ["id", "name", "listeners"];
  static readonly type: string = "ContainerNode";

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
  public readonly listeners = new Map<
    keyof Events | string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, functional/prefer-readonly-type
    Array<(event: any) => void>
  >();
  public readonly watchers = new Map<
    keyof Attrs | "*",
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, functional/prefer-readonly-type
    Map<CallbackWatcher<any> | CallbackWatcherAll<keyof Attrs, any>, boolean>
  >();

  constructor(
    attrs: Attrs,
    onNeedUpdate?: (prop: keyof Attrs) => void,
    // eslint-disable-next-line functional/prefer-readonly-type
    attrNoReactDraw?: string[]
  ) {
    this.attrs = createProxy(attrs, (prop, newVal, oldVal) => {
      this.watchers.forEach((listeners, selfProp) => {
        if (selfProp === "*") return;

        if (prop === selfProp) {
          listeners.forEach((_val, cb) => {
            (cb as CallbackWatcher<Attrs[typeof prop]>)(newVal, oldVal);
          });
          return;
        }

        if ((prop as string).startsWith(`${selfProp as string}.`)) {
          listeners.forEach((deep, cb) => {
            if (deep) {
              (cb as CallbackWatcher<Attrs[typeof prop]>)(newVal, oldVal);
            }
          });
        }
      });
      this.watchers.get("*")?.forEach((_deep, cb) =>
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (cb as CallbackWatcherAll<keyof Attrs, any>)(prop, newVal, oldVal)
      );

      if (
        !ContainerNode._attrNoReactDrawDefault.includes(prop as string) &&
        !attrNoReactDraw?.includes(prop as string)
      ) {
        onNeedUpdate?.(prop);
      }
    });

    this.attrs.listening?.forEach((cbs, name) => {
      cbs.forEach((cb) => this.on(name, cb));
    });
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
    const listeners = this.listeners.get(name);
    if (listeners) {
      // eslint-disable-next-line functional/immutable-data
      listeners.push(callback);
    } else {
      this.listeners.set(name, [callback]);
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
    const listeners = this.listeners.get(name);

    if (callback) {
      // eslint-disable-next-line functional/immutable-data
      listeners?.splice(listeners.indexOf(callback) >>> 0, 1);
    } else {
      // eslint-disable-next-line functional/immutable-data
      listeners?.splice(0);
    }

    return this;
  }
  public emit<Name extends keyof Events>(name: Name, event: Events[Name]): this;
  public emit(name: string, event: Event): this;
  public emit(name: string | keyof Events, event: Event): this {
    this.listeners.get(name)?.forEach((cb) => {
      cb.call(this, event);
    });

    return this;
  }

  public watch(
    prop: "*",
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    cb: CallbackWatcherAll<keyof Attrs, any>,
    options?: Omit<OptionsWatcher, "immediate">
  ): () => void;
  public watch<K extends keyof Attrs>(
    // eslint-disable-next-line functional/prefer-readonly-type
    prop: K | K[],
    cb: CallbackWatcher<Attrs[K]>,
    options?: OptionsWatcher
  ): () => void;
  public watch<K extends keyof Attrs>(
    // eslint-disable-next-line functional/prefer-readonly-type
    prop: K | K[] | "*",
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    cb: CallbackWatcher<Attrs[K]> | CallbackWatcherAll<keyof Attrs, any>,
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

      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      this.watchers.get(prop)!.set(cb, options?.deep ?? false);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if ((options as any)?.immediate) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const val = this.attrs[prop] as unknown as any;
        (cb as CallbackWatcher<Attrs[K]>)(val, val);
      }
    });

    return () =>
      // eslint-disable-next-line functional/prefer-readonly-type, @typescript-eslint/no-non-null-assertion
      (prop as K[]).forEach((prop) => this.watchers.get(prop)!.delete(cb));
  }

  public destroy(): void {
    this.listeners.clear();
    this.watchers.clear();
  }
}

declare class Empty {
  matches(selector: string): boolean;
}
export abstract class Container<
  Attrs extends Record<string, unknown> & AttrsIdentifitation,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Events extends Record<string, any>,
  T extends Empty
> extends ContainerNode<Attrs, Events> {
  static readonly type: string = "Container";
  public readonly children = new Set<T>();

  public find(selector: string) {
    return Array.from(this.children).filter((item) => item.matches(selector));
  }

  // eslint-disable-next-line functional/functional-parameters
  public add(...nodes: readonly T[]): void {
    nodes.forEach((node) => this.children.add(node));
  }
  // eslint-disable-next-line functional/functional-parameters
  public delete(...nodes: readonly T[]): void {
    nodes.forEach((node) => this.children.delete(node));
  }

  public destroy(): void {
    super.destroy();
    this.children.clear();
  }
}
