export function getMessage<T, R>(
  fn: (data: T) =>
    | {
        re: R
        transfer?: Transferable[]
      }
    | undefined
): void {
  self.addEventListener(
    "message",
    (event: MessageEvent<{ id: string; se: T }>) => {
      if (typeof event.data !== "object") return

      try {
        const result = fn(event.data.se)
        const { re, transfer } = result ?? {}
        self.postMessage(
          {
            id: event.data.id,
            re
          },
          { transfer }
        )
      } catch (err) {
        self.postMessage({
          id: event.data.id,
          re: err + "",
          error: true
        })
      }
    }
  )
}
