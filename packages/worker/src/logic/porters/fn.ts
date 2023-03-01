import { listen, put, uuid } from "@fcanvas/communicate"

export function createPortFn(
  port2: MessagePort,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  fn: (...a: any[]) => any
) {
  const id = uuid()

  const stop = listen(port2, id, fn)
  setTimeout(stop, 1000)

  return {
    __v_port: true,
    id
  }
}

export function resolvePortFn(
  port1: MessagePort,
  ported: ReturnType<typeof createPortFn>
) {
  // eslint-disable-next-line functional/functional-parameters
  return (...args: unknown[]) => {
    return put(port1, ported.id, ...args)
  }
}
