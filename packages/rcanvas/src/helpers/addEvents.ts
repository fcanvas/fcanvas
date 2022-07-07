export function addEvents(
  el: HTMLElement,
  events: string[],
  callback: (event: Event) => void
): void {
  events.forEach((event) => el.addEventListener(event, callback))
}
