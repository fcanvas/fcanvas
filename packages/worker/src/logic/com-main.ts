import { generateUUID } from "./generateUUID"

export function putMessage<R, T>(
  worker: Worker,
  data: T,
  transfer?: Transferable[]
): Promise<R> {
  return new Promise<R>((resolve, reject) => {
    const id = generateUUID()

    const handler = (
      event: MessageEvent<{ id: string; re: R; error?: true }>
    ) => {
      if (typeof event.data !== "object") return
      if (id !== event.data.id) return

      cancel()
      if (event.data.error) reject(new Error(event.data.re + ""))
      else resolve(event.data.re)
    }
    const handlerError = (err: ErrorEvent) => {
      cancel()
      reject(err)
    }

    const timeout = setTimeout(cancel, 30_000)

    function cancel() {
      clearTimeout(timeout)
      worker.removeEventListener("message", handler)
      worker.removeEventListener("error", handlerError)
    }

    worker.addEventListener("message", handler)
    worker.addEventListener("error", handlerError)

    worker.postMessage(
      {
        id,
        se: data
      },
      { transfer }
    )
  })
}
