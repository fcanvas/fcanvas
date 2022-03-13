import { createProxy } from "./helpers/createProxy";

type AttrsNode = {
  // eslint-disable-next-line functional/prefer-readonly-type
  id?: string;
  // eslint-disable-next-line functional/prefer-readonly-type
  name?: string;
};
type CallbackWatcher<T> = (newValue: T, oldValue: T) => void | Promise<void>;
type CallbackWatcherAll<P, T> = (
  prop: P,
  newValue: T,
  oldValue: T
) => void | Promise<void>;
type OptionsWatcher = {
  // eslint-disable-next-line functional/prefer-readonly-type
  immediate?: boolean;
};
export class ContainerNode<
  Attrs extends Record<string, unknown> & AttrsNode,
  Events extends Record<string, unknown>
> {
  static readonly _attrNoReactDrawDefault = ["id", "name"];

  public readonly type: string = "ContainerNode";
  public get id(): string | null {
    return this.attrs.id ?? null;
  }
  public get name(): string {
    return this.attrs.name ?? "";
  }
  public readonly attrs: Attrs;
  public readonly listeners = new Map<
    keyof Events,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, functional/prefer-readonly-type
    Array<(event: any) => void>
  >();
  public readonly watchers = new Map<
    keyof Attrs | "*",
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, functional/prefer-readonly-type
    Set<CallbackWatcher<any> | CallbackWatcherAll<keyof Attrs, any>>
  >();

  constructor(
    attrs: Attrs,
    onNeedUpdate?: (prop: keyof Attrs) => void,
    // eslint-disable-next-line functional/prefer-readonly-type
    attrNoReactDraw?: string[]
  ) {
    this.attrs = createProxy(attrs, (prop, newVal, oldVal) => {
      this.watchers
        .get(prop)
        ?.forEach((cb) =>
          (cb as CallbackWatcher<Attrs[typeof prop]>)(newVal, oldVal)
        );
      this.watchers.get("*")?.forEach((cb) =>
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
  ): this {
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
  public emit<Name extends keyof Events>(
    name: Name,
    event: Events[Name]
  ): this {
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
        this.watchers.set(prop, new Set());
      }

      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      this.watchers.get(prop)!.add(cb);

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
}

declare class Empty {
  matches(selector: string): boolean;
}
export class Container<
  Attrs extends Record<string, unknown> & AttrsNode,
  Events extends Record<string, unknown>,
  T extends Empty
> extends ContainerNode<Attrs, Events> {
  public readonly type: string = "Container";
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
}
