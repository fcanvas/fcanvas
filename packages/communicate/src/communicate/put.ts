import { uuid } from "../logic/uuid"
import type { DataCallFn, DataReturnFn, FnAny, LikeMessagePort } from "../type"

const storePut = new WeakMap<
  LikeMessagePort,
  {
    // eslint-disable-next-line func-call-spacing
    handle: (event: MessageEvent) => void
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    cbs: Set<(event: MessageEvent<DataReturnFn<any>>) => void>
  }
>()

function put<
  Options extends Record<string, FnAny>,
  Name extends keyof Options = keyof Options
>(
  port: LikeMessagePort,
  name: Name,
  ...args: Parameters<Options[Name]>
): Promise<Awaited<ReturnType<Options[Name]>>>
// eslint-disable-next-line no-redeclare
function put<Fn extends FnAny>(
  port: LikeMessagePort,
  name: string,
  ...args: Parameters<Fn>
): Promise<Awaited<ReturnType<Fn>>>

// eslint-disable-next-line no-redeclare
function put<
  Options extends Record<string, FnAny>,
  Name extends keyof Options = keyof Options
>(
  port: LikeMessagePort,
  options: {
    name: Name
    timeout?: number
    signal?: AbortSignal
  } & WindowPostMessageOptions,
  ...args: Parameters<Options[Name]>
): Promise<Awaited<ReturnType<Options[Name]>>>
// eslint-disable-next-line no-redeclare
function put<Fn extends FnAny>(
  port: LikeMessagePort,
  options: {
    name: string
    timeout?: number
    signal?: AbortSignal
  } & WindowPostMessageOptions,
  ...args: Parameters<Fn>
): Promise<Awaited<ReturnType<Fn>>>

// eslint-disable-next-line no-redeclare
function put<Fn extends FnAny>(
  port: LikeMessagePort,
  options:
    | string
    | ({
        name: string
        timeout?: number
        signal?: AbortSignal
      } & WindowPostMessageOptions),
  // eslint-disable-next-line functional/functional-parameters
  ...args: Parameters<Fn>
): Promise<Awaited<ReturnType<Fn>>> {
  return new Promise<Awaited<ReturnType<Fn>>>((resolve, reject) => {
    const id = uuid()

    // eslint-disable-next-line functional/no-let
    let name: string
    // eslint-disable-next-line functional/no-let
    let timeout = 30_000
    // eslint-disable-next-line functional/no-let
    let signal: AbortSignal | undefined
    if (typeof options === "object") {
      name = options.name
      timeout = options.timeout ?? 30_000
      signal = options.signal
    } else {
      name = options
    }

    if (signal?.aborted) {
      reject(new Error("aborted"))
      return
    }

    function handler(event: MessageEvent<DataReturnFn<Fn>>) {
      const { data } = event

      if (typeof data !== "object") return

      if (data.type === "return_fn" && data.id === id && data.name === name) {
        if (data.isOk) {
          resolve(data.retu)
        } else {
          if (data.retu.isError) reject(new Error(data.retu.data))
          else reject(JSON.parse(data.retu.data))
        }

        stop()
      }
    }

    const timeoutId =
      timeout > 0
        ? setTimeout(() => {
            stop()
            reject(new Error("timeout"))
          }, timeout)
        : null
    function onAbort() {
      stop()
      reject(new Error("aborted"))
    }

    // eslint-disable-next-line functional/no-let
    let conf = storePut.get(port)
    if (!conf) {
      const cbs: NonNullable<ReturnType<typeof storePut.get>>["cbs"] = new Set()
      cbs.add(handler)
      storePut.set(
        port,
        (conf = {
          handle(event) {
            cbs.forEach((cb) => cb(event))
          },
          cbs
        })
      )
      port.addEventListener("message", conf.handle)
    } else {
      conf.cbs.add(handler)
    }
    signal?.addEventListener("abort", onAbort)

    function stop() {
      timeoutId && clearTimeout(timeoutId)
      signal?.removeEventListener("abort", onAbort)

      const conf = storePut.get(port)
      if (!conf) return

      conf.cbs.delete(handler)

      if (conf.cbs.size === 0) {
        port.removeEventListener("message", conf.handle)
        storePut.delete(port)
      }
    }

    const message: DataCallFn<Fn> = {
      id,
      type: "call_fn",
      name,
      args
    }
    port.postMessage(message, typeof options === "object" ? options : undefined)
  })
}

export { put }
