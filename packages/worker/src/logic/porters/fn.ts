/* eslint-disable @typescript-eslint/ban-types */

import { listen, put, uuid } from "@fcanvas/communicate"

export function createPortFn(port2: MessagePort, fn: Function) {
  const id = uuid()

  // eslint-disable-next-line functional/functional-parameters
  const stop = listen(port2, id, (...args) => fn(...args))
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
