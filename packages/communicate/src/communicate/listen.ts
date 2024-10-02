/* eslint-disable @typescript-eslint/no-explicit-any */
import { isError } from "../logic/is-error"
import type {
  DataCallFn,
  DataReturnFn,
  FnAny,
  LikeMessagePort,
  MayBePromise,
  WindowPostMessageOptions
} from "../type"

const stringifyOrRaw = (data: any) => {
  try {
    return JSON.stringify(data)
  } catch {
    return JSON.stringify(data + "")
  }
}

const storeListen = new WeakMap<
  LikeMessagePort,
  {
    // eslint-disable-next-line func-call-spacing
    handle: (event: MessageEvent) => void
    cbs: Set<(event: MessageEvent<DataCallFn<any>>) => Promise<void>>
  }
>()

function listen<Fn extends FnAny>(
  port: LikeMessagePort,
  name: string,
  listener: (...args: Parameters<Fn>) => MayBePromise<
    | ({
        return: Awaited<ReturnType<Fn>>
      } & WindowPostMessageOptions)
    | Awaited<ReturnType<Fn>>
  >,
  options?: {
    once?: boolean
    unique?: boolean
    debug?: boolean
  }
): () => void
// eslint-disable-next-line no-redeclare
function listen<
  Options extends Record<any, FnAny>,
  Name extends keyof Options = keyof Options
>(
  port: LikeMessagePort,
  name: Name,
  listener: (...args: Parameters<Options[Name]>) => MayBePromise<
    | ({
        return: Awaited<ReturnType<Options[Name]>>
      } & WindowPostMessageOptions)
    | Awaited<ReturnType<Options[Name]>>
  >,
  options?: {
    once?: boolean
    unique?: boolean
    debug?: boolean
  }
): () => void

// eslint-disable-next-line no-redeclare
function listen<Options extends Record<any, FnAny>>(
  port: LikeMessagePort
): <Name extends keyof Options>(
  name: Name,
  listener: (...args: Parameters<Options[Name]>) => MayBePromise<
    | ({
        return: Awaited<ReturnType<Options[Name]>>
      } & WindowPostMessageOptions)
    | Awaited<ReturnType<Options[Name]>>
  >,
  options?: {
    once?: boolean
    unique?: boolean
    debug?: boolean
  }
) => () => void

// eslint-disable-next-line no-redeclare
function listen<Fn extends FnAny>(
  port: LikeMessagePort,
  name?: string,
  listener?: (...args: Parameters<Fn>) => MayBePromise<
    | ({
        return: Awaited<ReturnType<Fn>>
      } & WindowPostMessageOptions)
    | Awaited<ReturnType<Fn>>
  >,
  options?: {
    once?: boolean
    unique?: boolean
    debug?: boolean
  }
) {
  if (!name)
    return (
      name: string,
      listener$: Exclude<typeof listener, undefined>,
      options$: typeof options
    ) => listen(port, name, listener$, options$)

  async function handler(event: MessageEvent<DataCallFn<Fn>>) {
    const { data } = event
    if (typeof data !== "object") return

    if (data.type === "call_fn" && data.name === name) {
      if (options?.once) stop()

      if (data.ping) {
        listener!(...data.args)
        return
      }
      // eslint-disable-next-line functional/no-let
      let result:
        | ({
            return: ReturnType<Fn>
          } & WindowPostMessageOptions)
        | undefined
      // eslint-disable-next-line functional/no-let
      let err: unknown | undefined
      try {
        const r = await listener!(...data.args)

        if (r && typeof r === "object" && "return" in r) {
          result = r
        } else {
          result = {
            return: r
          }
        }
      } catch (error) {
        if (options?.debug) console.warn(error)
        err = error
      }

      const message: DataReturnFn<Fn> = {
        id: data.id,
        type: "return_fn",
        name: data.name,
        ...(result
          ? {
              retu: result.return,
              isOk: true
            }
          : {
              retu: isError(err)
                ? {
                    isError: true,
                    data: err.message
                  }
                : {
                    isError: false,
                    data: stringifyOrRaw(err)
                  },
              isOk: false
            })
      }

      port.postMessage(message, result)
    }
  }

  // eslint-disable-next-line functional/no-let
  let conf = storeListen.get(port)
  if (!conf) {
    if (options?.unique) {
      port.addEventListener("message", handler)
    } else {
      const cbs: NonNullable<ReturnType<typeof storeListen.get>>["cbs"] =
        new Set()
      cbs.add(handler)
      storeListen.set(
        port,
        (conf = {
          handle(event) {
            cbs.forEach((cb) => cb(event))
          },
          cbs
        })
      )
      port.addEventListener("message", conf.handle)
    }
  } else {
    conf.cbs.add(handler)
  }

  function stop() {
    if (options?.unique) {
      port.removeEventListener("message", handler)
      return
    }
    const conf = storeListen.get(port)
    if (!conf) return

    conf.cbs.delete(handler)

    if (conf.cbs.size === 0) {
      port.removeEventListener("message", conf.handle)
      storeListen.delete(port)
    }
  }

  return stop
}

export { listen }
