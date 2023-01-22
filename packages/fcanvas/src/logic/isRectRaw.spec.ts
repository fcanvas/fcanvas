import { Rect } from "../shapes/Rect"
import { isRectRaw } from "./isRectRaw"

describe("isRectRaw", () => {
  test("should is rect raw", () => {
    expect(isRectRaw({ x: 0, y: 0, width: 10, height: 10 })).toBe(true)
  })
  test("should is point", () => {
    expect(isRectRaw({ x: 0, y: 0 })).toBe(false)
  })
  test("should is Rect", () => {
    expect(isRectRaw(new Rect({ x: 0, y: 0, width: 10, height: 10 }))).toBe(
      false
    )
  })
  test("shoud is null", () => {
    expect(isRectRaw(null)).toBe(false)
  })
})
