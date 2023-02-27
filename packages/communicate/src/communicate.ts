/* eslint-disable functional/no-method-signature */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable functional/functional-parameters */
/** @worker */
// listen(port1, "<uid>", (args) => {
//   return 1343254
// })

import { uuid } from "./logic/uuid"

/** @threat */
// put(port2, "<uid>", args, {
//   timeout: 0
// })//: Promise<1343254>

type FnAny = (...args: any[]) => any
type MayBePromise<T> = T | Promise<T>
interface WindowPostMessageOptions {
  targetOrigin?: string
  transfer?: Transferable[]
}
interface LikeMessagePort {
  addEventListener(
    name: "message",
    cb: (event: MessageEvent<any>) => void,
    options?: unknown
  ): void
  removeEventListener(
    name: "message",
    cb: (event: MessageEvent<any>) => void,
    options?: unknown
  ): void
  postMessage(message: any, options?: unknown): void
}
interface DataCallFn<Fn extends (...args: unknown[]) => unknown> {
  id: string
  type: "call_fn"
  name: string
  args: Parameters<Fn>
  ping?: true
}
type DataReturnFn<Fn extends (...args: unknown[]) => unknown> =
  | {
      id: string
      type: "return_fn"
      name: string
      isOk: true
      retu: ReturnType<Fn>
    }
  | {
      id: string
      type: "return_fn"
      name: string
      isOk: false
      retu: string
    }

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

  port.addEventListener("message", handler)
  function stop() {
    port.removeEventListener("message", handler)
  }

  return stop
}

function put<
  Options extends Record<string, FnAny>,
  Name extends keyof Options = keyof Options
>(
  port: LikeMessagePort,
  name: Name,
  ...args: Parameters<Options[Name]>
): Promise<ReturnType<Options[Name]>>
// eslint-disable-next-line no-redeclare
function put<Fn extends FnAny>(
  port: LikeMessagePort,
  name: string,
  ...args: Parameters<Fn>
): Promise<ReturnType<Fn>>

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
): Promise<ReturnType<Options[Name]>>
// eslint-disable-next-line no-redeclare
function put<Fn extends FnAny>(
  port: LikeMessagePort,
  options: {
    name: string
    timeout?: number
    signal?: AbortSignal
  } & WindowPostMessageOptions,
  ...args: Parameters<Fn>
): Promise<ReturnType<Fn>>

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
  ...args: Parameters<Fn>
): Promise<ReturnType<Fn>> {
  return new Promise<ReturnType<Fn>>((resolve, reject) => {
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
        if (data.isOk) resolve(data.retu)
        else reject(new Error(data.retu))

        stop()
      }
    }

    const timeoutId = setTimeout(() => {
      stop()
      reject(new Error("timeout"))
    }, timeout)
    function onAbort() {
      stop()
      reject(new Error("aborted"))
    }

    port.addEventListener("message", handler)
    signal?.addEventListener("abort", onAbort)

    function stop() {
      clearTimeout(timeoutId)
      port.removeEventListener("message", handler)
      signal?.removeEventListener("abort", onAbort)
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

function pit<
  Options extends Record<string, FnAny>,
  Name extends keyof Options = keyof Options
>(port: LikeMessagePort, name: Name, ...args: Parameters<Options[Name]>): void
// eslint-disable-next-line no-redeclare
function pit<Fn extends FnAny>(
  port: LikeMessagePort,
  name: string,
  ...args: Parameters<Fn>
): void

// eslint-disable-next-line no-redeclare
function pit<
  Options extends Record<string, FnAny>,
  Name extends keyof Options = keyof Options
>(
  port: LikeMessagePort,
  options:
    | {
        name: Name
      } & WindowPostMessageOptions,
  ...args: Parameters<Options[Name]>
): void
// eslint-disable-next-line no-redeclare
function pit<Fn extends FnAny>(
  port: LikeMessagePort,
  options: {
    name: string
  } & WindowPostMessageOptions,
  ...args: Parameters<Fn>
): void

// eslint-disable-next-line no-redeclare
function pit<Fn extends FnAny>(
  port: LikeMessagePort,
  options: {
    name: string
  } & WindowPostMessageOptions,
  ...args: Parameters<Fn>
): void
// eslint-disable-next-line no-redeclare
function pit<Fn extends FnAny>(
  port: LikeMessagePort,
  options:
    | string
    | ({
        name: string
      } & WindowPostMessageOptions),
  ...args: Parameters<Fn>
): void {
  // eslint-disable-next-line functional/no-let
  let name: string
  if (typeof options === "object") name = options.name
  else name = options

  const message: DataCallFn<Fn> = {
    id: "0",
    type: "call_fn",
    name,
    args,
    ping: true
  }
  port.postMessage(message, typeof options === "object" ? options : undefined)
}

export { listen, put, pit, pit as ping }
