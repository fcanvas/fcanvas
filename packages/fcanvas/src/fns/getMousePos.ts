interface MousePos {
  x: number
  y: number
  winX: number
  winY: number
  id: number
}

export function getMousePos(
  event: TouchEvent | MouseEvent,
  element?: HTMLElement & {
    width?: number
    height?: number
  },
  limit = 1
): MousePos[] {
  const rect = element?.getBoundingClientRect() ?? { left: 0, top: 0 }
  const sx = element
    ? (element.width && element.scrollWidth / element.width) || 1
    : 1
  const sy = element
    ? (element.height && element.scrollHeight / element.height) || 1
    : 1

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
