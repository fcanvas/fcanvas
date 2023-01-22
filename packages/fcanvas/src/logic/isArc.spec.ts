import { Arc } from "../shapes/Arc"

import { isArc } from "./isArc"

describe("isCircleRaw", () => {
  test("should is Arc", () => {
    expect(
      isArc(new Arc({ x: 0, y: 0, innerRadius: 15, outerRadius: 20 }))
    ).toBe(true)
  })
  test("should is circle raw", () => {
    expect(isArc({ x: 0, y: 0, radius: 20 })).toBe(false)
  })
  test("should is point", () => {
    expect(isArc({ x: 0, y: 0 })).toBe(false)
  })
  test("shoud is null", () => {
    expect(isArc(null)).toBe(false)
  })
})
