export class Range {
  static areEqual(a: Range, b: Range) {
    // Based on https://github.com/python/cpython/blob/cff677abe1823900e954592035a170eb67840971/Objects/rangeobject.c#L425
    if (a === b) return true
    if (a.length !== b.length) return false
    if (a.length === 0) return true
    if (a.start !== b.start) return false
    if (a.length === 1) return true
    return a.step === b.step
  }

  public start: number

  public stop: number

  public step: number

  constructor(stop: number)
  constructor(start: number, stop: number, step?: number)
  constructor(start: number, stop?: number, step = 1) {
    if (stop === undefined) [start, stop] = [0, start]
    ;[this.start, this.stop, this.step] = [start, stop, step]

    return this
  }

  public get length(): number {
    const length = Math.ceil((this.stop - this.start) / this.step)
    return Math.max(0, length)
  }

  public get(index: number) {
    if (index < this.length) return this.start + this.step * index
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public forEach<ThisArg = any>(
    callback: (
      this: ThisArg,
      value: number,
      index: number,
      range: this
    ) => void,
    thisArg: ThisArg
  ) {
    // eslint-disable-next-line functional/no-let
    for (let i = 0; i < this.length; i += 1) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      callback.call(thisArg, this.get(i)!, i, this)
    }
  }

  public includes(value: number) {
    return (
      (this.step > 0
        ? value >= this.start && value < this.stop
        : value > this.stop && value <= this.start) &&
      (value - this.start) % this.step === 0
    )
  }

  public min() {
    if (this.length !== 0) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      return this.get(this.step > 0 ? 0 : this.length - 1)!
    }
    return Infinity
  }

  public max() {
    if (this.length !== 0) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      return this.get(this.step > 0 ? this.length - 1 : 0)!
    }
    return -Infinity
  }

  public reverse() {
    ;[this.start, this.stop, this.step] = [
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      this.get(this.length - 1)!,
      this.start - Math.sign(this.step),
      -this.step
    ]
    return this
  }

  public toString() {
    return `range(${this.start}, ${this.stop}, ${this.step})`
  }

  public valueOf() {
    return this.toString()
  }

  public inspect() {
    return this.toString()
  }

  public *[Symbol.iterator]() {
    // eslint-disable-next-line functional/no-let
    for (let i = 0; i < this.length; i += 1) yield this.get(i)
  }

  public [Symbol.toStringTag] = "Range"
  public values() {
    return this[Symbol.iterator]()
  }
}

function range(stop: number): Range
// eslint-disable-next-line no-redeclare
function range(start: number, stop: number, step?: number): Range
// eslint-disable-next-line @typescript-eslint/no-explicit-any, no-redeclare
function range(start: any, stop?: any, step?: any) {
  return new Range(start, stop, step)
}

export { range }
