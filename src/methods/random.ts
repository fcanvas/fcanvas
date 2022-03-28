function random(value: number): number;
function random<T>(array: ArrayLike<T>): T;
function random(start: number, stop: number): number;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function random(start: any, stop?: any) {
  if (stop === void 0) {
    if (typeof start === "number") {
      return Math.random() * start;
    }

    return start[~~(Math.random() * start.length)];
  }

  return start + Math.random() * (stop - start);
}

export { random };
