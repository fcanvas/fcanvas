function random(value: number): number
// eslint-disable-next-line no-redeclare
function random<T>(array: ArrayLike<T>): T
// eslint-disable-next-line no-redeclare
function random(start: number, stop: number): number
// eslint-disable-next-line @typescript-eslint/no-explicit-any, no-redeclare
function random(start: any, stop?: any) {
  if (stop === undefined) {
    if (typeof start === "number") return Math.random() * start

    return start[~~(Math.random() * start.length)]
  }

  return start + Math.random() * (stop - start)
}

export { random }
