export function getDurationGravity(hStart: number, hStop: number): number
// eslint-disable-next-line no-redeclare
export function getDurationGravity(h: number): number

// eslint-disable-next-line no-redeclare
export function getDurationGravity(
  start: number,
  stop?: number
): number {
  if (stop === undefined) start = (stop - start)
  
  return Math.sqrt(2 * start / (Math.PI ** 2))
}
