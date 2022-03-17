// eslint-disable-next-line @typescript-eslint/no-explicit-any
const weakCache = new WeakMap<Record<string, unknown>, any>();

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function createProxy<R extends Record<string, any>>(
  target: R,
  onsetter: (prop: keyof R, newVal: R[keyof R], oldVal: R[keyof R]) => void,
  ongetter?: (prop: keyof R) => void,
  props = ""
): R {
  if (weakCache.has(target)) {
    return weakCache.get(target);
  }

  const proxy = new Proxy(target, {
    get(target, prop) {
      const mykey =
        props === "" ? (prop as string) : `${props}.${prop as string}`;
      ongetter?.(mykey);

      if (
        target[prop as string] !== null &&
        typeof target[prop as string] === "object"
      ) {
        return createProxy(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          target[prop as string] as any,
          onsetter,
          ongetter,
          mykey
        );
      }

      return target[prop as string];
    },
    set(target, prop, val) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const oldVal = (target as any)[prop as string]

      if (Object.is(oldVal, val)) {
        return true;
      }

      (target as any)[prop as string] = val;

      onsetter(
        props === "" ? (prop as string) : `${props}.${prop as string}`,
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
