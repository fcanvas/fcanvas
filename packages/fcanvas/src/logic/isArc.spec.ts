import { Arc } from "../shapes/Arc"
import { isCircleRaw } from "./isCircleRaw"

describe("isCircleRaw", () => {
  test("should is Arc", () => {
    expect(
      isCircleRaw(new Arc({ x: 0, y: 0, innerRadius: 15, outerRadius: 20 }))
    ).toBe(true)
  })
  test("should is circle raw", () => {
    expect(isCircleRaw({ x: 0, y: 0, radius: 20 })).toBe(false)
  })
  test("should is point", () => {
    expect(isCircleRaw({ x: 0, y: 0 })).toBe(false)
  })
  test("shoud is null", () => {
    expect(isCircleRaw(null)).toBe(false)
  })
})
