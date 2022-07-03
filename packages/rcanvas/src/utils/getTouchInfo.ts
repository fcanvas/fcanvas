export function getTouchInfo<
  T extends {
    clientX: number
    clientY: number
    identifier?: number
  }
>(
  element: HTMLCanvasElement,
  touches: readonly T[]
): readonly {
  readonly x: number
  readonly y: number
  readonly winX: number
  readonly winY: number
  readonly id: number
}[] {
  const rect = element.getBoundingClientRect()
  const sx = element.scrollWidth / element.width || 1
  const sy = element.scrollHeight / element.height || 1
  const _touches = []
  const length = touches.length
  // eslint-disable-next-line functional/no-let
  let i = 0
  // eslint-disable-next-line functional/no-let
  let touch: T

  while (i < length) {
    touch = touches[i++]

    _touches.push({
      x: (touch.clientX - rect.left) / sx,
      y: (touch.clientY - rect.top) / sy,
      winX: touch.clientX,
      winY: touch.clientY,
      id: touch.identifier ?? Math.random()
    })
  }
  return _touches
}
