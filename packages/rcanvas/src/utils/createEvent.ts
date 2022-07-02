// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function createEvent(type: string, target: any): Event {
  const event = new Event(type)
  Object.defineProperty(event, "target", {
    writable: false,
    value: target
  })

  return event
}
