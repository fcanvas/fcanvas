import { Circle } from "../shapes/Circle"
import { Rect } from "../shapes/Rect"
import { isCircleRaw } from "./isCircleRaw"

describe("isCircleRaw", () => {
  test("should is Circle", () => {
    expect(isCircleRaw(new Circle({ x: 0, y: 0, radius: 20 }))).toBe(true)
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
