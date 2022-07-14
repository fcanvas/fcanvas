import { describe, expect, test } from "vitest"

import { pointInCircle } from "./pointInCircle"

describe("pointInCircle", () => {
  test("should return true if point is in circle", () => {
    expect(pointInCircle(0, 0, 0, 0, 150)).toBe(true)
    expect(pointInCircle(150, 0, 0, 0, 150)).toBe(true)
  })
  test("should return false if point is not in circle", () => {
    expect(pointInCircle(151, 150, 0, 0, 150)).toBe(false)
    expect(pointInCircle(150, 150, 0, 0, 150)).toBe(false)
  })
})
