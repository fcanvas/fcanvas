// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function extendTarget<T extends object>(type: T, target: any): T {
  Object.defineProperty(type, "target", {
    writable: false,
    value: target
  })

  return type
}
