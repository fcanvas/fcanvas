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

interface DataCallFn<Fn extends (...args: unknown[]) => unknown> {
  id: string
  type: "call_fn"
  name: string
  args: Parameters<Fn>
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

type MayBePromise<T> = T | Promise<T>
function listen<Fn extends (...args: any[]) => any>(
  port: MessagePort,
  name: string,
  listener: (
    ...args: Parameters<Fn>
  ) => MayBePromise<
    | [ReturnType<Fn>, (StructuredSerializeOptions | Transferable[])?]
    | ReturnType<Fn>
  >,
  options?: {
    once?: boolean
  }
) {
  async function handler(event: MessageEvent<DataCallFn<Fn>>) {
    const { data } = event
    if (typeof data !== "object") return

    if (data.type === "call_fn" && data.name === name) {
      // eslint-disable-next-line functional/no-let
      let result:
        | [ReturnType<Fn>, (StructuredSerializeOptions | Transferable[])?]
        | undefined
      // eslint-disable-next-line functional/no-let
      let err: string | undefined
      try {
        const r = await listener(...data.args)

        if (Array.isArray(r)) result = r
        else result = [r]
      } catch (error) {
        err = error + ""
      }

      const message: DataReturnFn<Fn> = {
        id: data.id,
        type: "return_fn",
        name: data.name,
        ...(result
          ? {
              retu: result[0],
              isOk: true
            }
          : {
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              retu: err!,
              isOk: false
            })
      }
      port.postMessage(message, result?.[1] as unknown as any)

      if (options?.once) stop()
    }
  }

  port.addEventListener("message", handler)
  function stop() {
    port.removeEventListener("message", handler)
  }

  return stop
}

function put<Fn extends (...args: any[]) => any>(
  port: MessagePort,
  name: string,
  ...args: Parameters<Fn>
): Promise<ReturnType<Fn>>
// eslint-disable-next-line no-redeclare
function put<Fn extends (...args: any[]) => any>(
  port: MessagePort,
  options: {
    name: string
    timeout?: number
    transfer?: Transferable[]
    signal?: AbortSignal
  },
  ...args: Parameters<Fn>
): Promise<ReturnType<Fn>>
// eslint-disable-next-line no-redeclare
function put<Fn extends (...args: any[]) => any>(
  port: MessagePort,
  options:
    | string
    | {
        name: string
        timeout?: number
        transfer?: Transferable[]
        signal?: AbortSignal
      },
  ...args: Parameters<Fn>
): Promise<ReturnType<Fn>> {
  return new Promise<ReturnType<Fn>>((resolve, reject) => {
    const id = uuid()

    // eslint-disable-next-line functional/no-let
    let name: string
    // eslint-disable-next-line functional/no-let
    let timeout = 30_000
    // eslint-disable-next-line functional/no-let
    let transfer: Transferable[] | undefined
    // eslint-disable-next-line functional/no-let
    let signal: AbortSignal | undefined
    if (typeof options === "object") {
      name = options.name
      timeout = options.timeout ?? 30_000
      transfer = options.transfer
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
    port.postMessage(message, transfer as unknown as any)
  })
}

export { listen, put }
