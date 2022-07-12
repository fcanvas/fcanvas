// eslint-disable-next-line @typescript-eslint/consistent-type-definitions, @typescript-eslint/no-explicit-any
export type ElAddEventListener<Event extends string = any> = {
  addEventListener?: (type: Event, listener: (event: Event) => void) => void
  on?: (type: Event, listener: (event: Event) => void, root?: boolean) => void
}

export function addEvents(
  el: ElAddEventListener,
  events: string[],
  callback: (event: Event) => void
): void {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const register = (el.addEventListener || el.on)!.bind(el)
  events.forEach((event) => register(event, callback, true))
}
