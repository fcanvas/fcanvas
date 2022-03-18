// eslint-disable-next-line @typescript-eslint/no-explicit-any
const weakCache = new WeakMap<Record<string, unknown>, any>();

type Join<K, P> = K extends string | number
  ? P extends string | number
    ? `${K}${"" extends P ? "" : "."}${P}`
    : never
  : never;
// eslint-disable-next-line functional/prefer-readonly-type
type Prev = [
  never,
  0,
  1,
  2,
  3,
  4,
  5,
  6,
  7,
  8,
  9,
  10,
  // eslint-disable-next-line functional/prefer-readonly-type
  11,
  12,
  13,
  14,
  15,
  16,
  17,
  18,
  19,
  20,
  ...0[]
];
// eslint-disable-next-line functional/prefer-readonly-type, @typescript-eslint/ban-types
type Paths<T, D extends number = 10> = [D] extends [never]
  ? never
  : T extends object
  ? // eslint-disable-next-line functional/prefer-readonly-type
    {
      [K in keyof T]-?: K extends string | number
        ? `${K}` | Join<K, Paths<T[K], Prev[D]>>
        : never;
    }[keyof T]
  : "";

//     // eslint-disable-next-line functional/prefer-readonly-type, @typescript-eslint/ban-types
// type Leaves<T, D extends number = 10> = [D] extends [never] ? never : T extends object ?
//     // eslint-disable-next-line functional/prefer-readonly-type
//     {
//          [K in keyof T]-?: Join<K, Leaves<T[K], Prev[D]>> }[keyof T] : "";

// eslint-disable-next-line functional/prefer-readonly-type
export function createProxy<
  R extends {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key in string]: any;
  },
  K extends Paths<R>
>(
  target: R,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onsetter: (prop: K, newVal: any, oldVal: any) => void,
  ongetter?: (prop: K) => void,
  props = ""
): R {
  if (weakCache.has(target)) {
    return weakCache.get(target);
  }

  const proxy = new Proxy(target, {
    get(target, prop) {
      const mykey = (
        props === "" ? (prop as string) : `${props}.${prop as string}`
      ) as K;
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
