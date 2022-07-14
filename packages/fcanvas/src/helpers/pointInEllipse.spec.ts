import { describe, expect, test } from "vitest"

import { pointInEllipse } from "./pointInEllipse"

describe("pointInEllipse", () => {
  test("should return true if point is in ellipse", () => {
    expect(pointInEllipse(0, 0, 0, 0, 150, 50)).toBe(true)
  })
  test("should return false if point is not in ellipse", () => {
    expect(pointInEllipse(151, 0, 0, 0, 150, 50)).toBe(false)
    expect(pointInEllipse(150, 50, 0, 0, 150, 50)).toBe(false)
  })
})
