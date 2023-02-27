import { getPropsNameEvent } from "../getPropsNameEvent"

export function copyObjectWithoutNode<T>(obj: T): T {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const clone: any = {}

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getPropsNameEvent(obj as unknown as any).forEach((prop) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const value = (obj as unknown as any)[prop]
    clone[prop] = value instanceof Node ? null : value
  })

  return clone
}

export function createPortTouchList(value: TouchList) {
  return {
    __v_type: "TouchList",
    value: Array.from(value).map(copyObjectWithoutNode)
  }
}
export function resolvePortTouchList({
  value
}: ReturnType<typeof createPortTouchList>) {
  return Object.assign({}, value, {
    item(index: number) {
      return value[index] ?? null
    },
    get length() {
      return value.length
    },
    * [Symbol.iterator]() {
      // eslint-disable-next-line functional/no-let
      for (let i = 0; i < value.length; i += 1) yield value[i]
    },
    [Symbol.toStringTag]: "TouchList"
  })
}
