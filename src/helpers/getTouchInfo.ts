export function getTouchInfo(
  element: HTMLCanvasElement,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  touches: readonly any[]
): readonly {
  readonly x: number;
  readonly y: number;
  readonly winX: number;
  readonly winY: number;
  readonly id: number;
}[] {
  const rect = element.getBoundingClientRect();
  const sx = element.scrollWidth / element.width || 1;
  const sy = element.scrollHeight / element.height || 1;
  const _touches = [],
    length = touches.length;
  // eslint-disable-next-line functional/no-let
  let i = 0,
    touch;
  // eslint-disable-next-line functional/no-loop-statement
  while (i < length) {
    touch = touches[i++];
    // eslint-disable-next-line functional/immutable-data
    _touches.push({
      x: (touch.clientX - rect.left) / sx,
      y: (touch.clientY - rect.top) / sy,
      winX: touch.clientX,
      winY: touch.clientY,
      id: touch.identifier ?? Math.random(),
    });
  }
  return _touches;
}
