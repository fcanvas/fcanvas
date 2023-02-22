export function isCanvasDOM(
  el: HTMLCanvasElement | OffscreenCanvas
): el is HTMLCanvasElement {
  return (el as HTMLCanvasElement)?.style !== undefined
}
