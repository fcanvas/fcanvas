// eslint-disable-next-line @typescript-eslint/consistent-type-definitions, @typescript-eslint/no-explicit-any
export type ElRemoveEventListener<Event extends string = any> = {
  removeEventListener?: (type: Event, listener: (event: Event) => void) => void
  off?: (type: Event, listener: (event: Event) => void, root?: boolean) => void
}

export function rmEvents(
  el: ElRemoveEventListener,
  events: string[],
  callback: (event: Event) => void
): void {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const unRegister = (el.removeEventListener || el.off)!.bind(el)
  events.forEach((event) => unRegister(event, callback, true))
}
