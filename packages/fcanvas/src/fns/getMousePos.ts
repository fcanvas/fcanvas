/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable indent */
interface MousePos {
  x: number
  y: number
  winX: number
  winY: number
  id: number
}

function isHTMLElement(el: any): el is HTMLElement {
  return typeof el?.getBoundingClientRect === "function"
}

function getSx(info: { width?: number; scrollWidth: number }): number {
  return (info.width && info.scrollWidth / info.width) || 1
}
function getSy(info: { height?: number; scrollHeight: number }): number {
  return (info.height && info.scrollHeight / info.height) || 1
}

export function getMousePos(
  event: TouchEvent | MouseEvent,
  element?: OffscreenCanvas | HTMLCanvasElement,
  uid?: string,
  limit = 1
): MousePos[] {
  const isElement = isHTMLElement(element)
  const info = isElement
    ? undefined
    : uid
    ? (event as unknown as any)?.info[uid]
    : undefined

  const rect = isElement
    ? element.getBoundingClientRect()
    : info ?? {
        left: 0,
        top: 0
      }
  const sx = isElement ? getSx(element) : info ? getSx(info) : 1
  const sy = isElement ? getSy(element) : info ? getSy(info) : 1

  const touches = (event as TouchEvent).touches ||
    (event as TouchEvent).changedTouches || [event]
  const _touches = []
  const length = touches.length
  // eslint-disable-next-line functional/no-let
  let i = 0
  // eslint-disable-next-line functional/no-let
  let touch

  while (i < length) {
    touch = touches[i++]

    _touches.push({
      x: (touch.clientX - rect.left) / sx,
      y: (touch.clientY - rect.top) / sy,
      winX: touch.clientX,
      winY: touch.clientY,
      id: touch.identifier ?? Math.random()
    })

    if (limit === i) break
  }
  return _touches
}
