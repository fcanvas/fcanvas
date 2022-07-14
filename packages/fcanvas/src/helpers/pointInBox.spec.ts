import { describe, expect, test } from "vitest"

import { pointInBox } from "./pointInBox"

describe("pointInBox", () => {
  test("should return true if point is in box", () => {
    expect(pointInBox(0, 0, 0, 0, 150, 50)).toBe(true)
    expect(pointInBox(150, 50, 0, 0, 150, 50)).toBe(true)
  })
  test("should return false if point is not in box", () => {
    expect(pointInBox(151, 0, 0, 0, 150, 50)).toBe(false)
  })
})
