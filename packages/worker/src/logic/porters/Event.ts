/* eslint-disable @typescript-eslint/no-explicit-any */

import { NOOP } from "fcanvas"

import { getPropsNameEvent } from "../getPropsNameEvent"

import {
  copyObjectWithoutNode,
  createPortTouchList,
  resolvePortTouchList
} from "./TouchList"
import { createPortFn, resolvePortFn } from "./fn"

function type(value: any) {
  return (value + "").slice(8, -1)
}

function createFakeEvent<T extends Event>(
  port2: MessagePort,
  event: T,
  bypassFn?: boolean
): {
  [K in keyof T]: T[K] extends (...args: unknown[]) => unknown
    ? ReturnType<typeof createPortFn>
    : T[K] extends TouchList
    ? ReturnType<typeof createPortTouchList>
    : T[K]
} {
  const props = getPropsNameEvent(event) as Array<keyof T>

  const fake: any = {}

  props.forEach((prop) => {
    const value = event[prop]
    if (value instanceof Node) {
      fake[prop] = null
      return
    }
    if (typeof value === "function") {
      fake[prop] = bypassFn ? NOOP : createPortFn(port2, value.bind(event))
      return
    }

    switch (type(value)) {
      case "TouchList":
        fake[prop] = createPortTouchList(value as TouchList)
        break
      case "Window":
        fake[prop] = null
        break
      default:
        if (value && typeof value === "object")
          fake[prop] = copyObjectWithoutNode(value)
        else fake[prop] = value
    }
  })

  return fake
}
function resolveFakeEvent<T extends Event>(
  port1: MessagePort,
  fake: ReturnType<typeof createFakeEvent<T>>
): {
  [K in keyof T]: T[K] extends (...args: infer P) => infer R
    ? (...args: P) => Promise<R>
    : T[K]
} {
  Object.entries(fake).forEach(([prop, value]) => {
    if (value?.__v_port)
      (fake as unknown as any)[prop] = resolvePortFn(port1, value)
    if (value?.__v_type === "TouchList") {
      ;(fake as unknown as any)[prop] = resolvePortTouchList(value)
    }
  })

  return fake as unknown as any
}

export { createFakeEvent, resolveFakeEvent }
