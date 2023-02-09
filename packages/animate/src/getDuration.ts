export function getDuration(start: number, stop: number, speed: number): number
// eslint-disable-next-line no-redeclare
export function getDuration(distance: number, speed: number): number

// eslint-disable-next-line no-redeclare
export function getDuration(
  start: number,
  stop: number,
  speed?: number
): number {
  if (speed !== undefined) start = stop - start
  else speed = stop

  return start / speed
}
