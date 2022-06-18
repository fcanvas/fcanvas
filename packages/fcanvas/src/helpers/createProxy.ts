// eslint-disable-next-line @typescript-eslint/no-explicit-any
const weakCache = new WeakMap<Record<string, unknown>, any>()

export function createProxy<
  R extends {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, no-unused-vars
    [key in string]: any
  },
  K extends string & keyof R
>(
  target: R,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onsetter: (prop: K, newVal: any, oldVal: any) => void,

  propsProxyIgnore?: (keyof R)[],
  props = ""
): R {
  if (weakCache.has(target)) return weakCache.get(target)

  const proxy = new Proxy(target, {
    get(target, prop) {
      if (target === undefined && (prop === "raws" || prop === "refs")) {
        // eslint-disable-next-line functional/immutable-data, @typescript-eslint/no-explicit-any
        ;(target as any)[prop as string] = {} as unknown
      }

      if (
        prop !== "raws" &&
        (!propsProxyIgnore || propsProxyIgnore.every((test) => test !== prop))
      ) {
        const mykey = (
          props === "" ? (prop as string) : `${props}.${prop as string}`
        ) as K

        if (
          target[prop as string] !== null &&
          typeof target[prop as string] === "object"
        ) {
          return createProxy(
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            target[prop as string] as any,
            onsetter,
            undefined,
            mykey
          )
        }
      }

      return target[prop as string]
    },
    set(target, prop, val) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const oldVal = (target as any)[prop as string]

      if (Object.is(oldVal, val))
        return true

      // eslint-disable-next-line @typescript-eslint/no-explicit-any, functional/immutable-data
      ;(target as any)[prop as string] = val

      onsetter(
        (props === "" ? (prop as string) : `${props}.${prop as string}`) as K,
        val,
        oldVal
      )

      return true
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  }) as unknown as any
  weakCache.set(target, proxy)

  return proxy
}
