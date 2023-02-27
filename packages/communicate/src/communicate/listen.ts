/* eslint-disable @typescript-eslint/no-explicit-any */
import type {
  DataCallFn,
  DataReturnFn,
  FnAny,
  LikeMessagePort,
  MayBePromise
} from "../type"

const storeListen = new WeakMap<
  LikeMessagePort,
  {
    // eslint-disable-next-line func-call-spacing
    handle: (event: MessageEvent) => void
    cbs: Set<(event: MessageEvent<DataCallFn<any>>) => Promise<void>>
  }
>()
const resolved = Promise.resolve()

function listen<Fn extends FnAny>(
  port: LikeMessagePort,
  name: string,
  listener: (...args: Parameters<Fn>) => MayBePromise<
    | ({
        return: ReturnType<Fn>
      } & WindowPostMessageOptions)
    | ReturnType<Fn>
  >,
  options?: {
    once?: boolean
    debug?: boolean
  }
): () => void
// eslint-disable-next-line no-redeclare
function listen<
  Options extends Record<string, FnAny>,
  Name extends keyof Options = keyof Options
>(
  port: LikeMessagePort,
  name: Name,
  listener: (...args: Parameters<Options[Name]>) => MayBePromise<
    | ({
        return: ReturnType<Options[Name]>
      } & WindowPostMessageOptions)
    | ReturnType<Options[Name]>
  >,
  options?: {
    once?: boolean
    debug?: boolean
  }
): () => void

// eslint-disable-next-line no-redeclare
function listen<Fn extends FnAny>(
  port: LikeMessagePort,
  name: string,
  listener: (...args: Parameters<Fn>) => MayBePromise<
    | ({
        return: ReturnType<Fn>
      } & WindowPostMessageOptions)
    | ReturnType<Fn>
  >,
  options?: {
    once?: boolean
    debug?: boolean
  }
) {
  async function handler(event: MessageEvent<DataCallFn<Fn>>) {
    const { data } = event
    if (typeof data !== "object") return

    if (data.type === "call_fn" && data.name === name) {
      if (data.ping) {
        listener(...data.args)
        return
      }
      // eslint-disable-next-line functional/no-let
      let result:
        | ({
            return: ReturnType<Fn>
          } & WindowPostMessageOptions)
        | undefined
      // eslint-disable-next-line functional/no-let
      let err: string | undefined
      try {
        const r = await listener(...data.args)

        if (r && typeof r === "object" && "return" in r) {
          result = r
        } else {
          result = {
            return: r
          }
        }
      } catch (error) {
        if (options?.debug) console.warn(error)
        err = error + ""
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
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              retu: err!,
              isOk: false
            })
      }

      port.postMessage(message, result)

      if (options?.once) stop()
    }
  }

  // eslint-disable-next-line functional/no-let
  let conf = storeListen.get(port)
  if (!conf) {
    const cbs: NonNullable<ReturnType<typeof storeListen.get>>["cbs"] =
      new Set()
    cbs.add(handler)
    storeListen.set(
      port,
      (conf = {
        handle(event) {
          // eslint-disable-next-line no-void, promise/no-callback-in-promise
          cbs.forEach((cb) => resolved.then(() => void cb(event)))
        },
        cbs
      })
    )
    port.addEventListener("message", conf.handle)
  } else {
    conf.cbs.add(handler)
  }

  function stop() {
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
