// eslint-disable-next-line @typescript-eslint/no-explicit-any
const weakCache = new WeakMap<Record<string, unknown>, any>();

export function createProxy<
  // eslint-disable-next-line functional/prefer-readonly-type
  R extends {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key in string]: any;
  },
  K extends string & keyof R
>(
  target: R,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onsetter: (prop: K, newVal: any, oldVal: any) => void,
  // eslint-disable-next-line functional/prefer-readonly-type
  propsProxyIgnore?: (keyof R)[],
  props = ""
): R {
  if (weakCache.has(target)) {
    return weakCache.get(target);
  }

  const proxy = new Proxy(target, {
    get(target, prop) {
      if (!propsProxyIgnore?.includes(prop as keyof R)) {
        const mykey = (
          props === "" ? (prop as string) : `${props}.${prop as string}`
        ) as K;

        if (
          target[prop as string] !== null &&
          typeof target[prop as string] === "object"
        ) {
          return createProxy(
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            target[prop as string] as any,
            onsetter,
            void 0,
            mykey
          );
        }
      }

      if (target === void 0 && (prop === "raws" || prop === "refs")) {
        // eslint-disable-next-line functional/immutable-data, @typescript-eslint/no-explicit-any
        (target as any)[prop as string] = {} as unknown;
      }

      return target[prop as string];
    },
    set(target, prop, val) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const oldVal = (target as any)[prop as string];

      if (Object.is(oldVal, val)) {
        return true;
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any, functional/immutable-data
      (target as any)[prop as string] = val;

      onsetter(
        (props === "" ? (prop as string) : `${props}.${prop as string}`) as K,
        val,
        oldVal
      );

      return true;
    },

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  }) as unknown as any;
  weakCache.set(target, proxy);

  return proxy;
}
