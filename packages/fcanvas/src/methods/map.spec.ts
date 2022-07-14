import { describe, expect, test } from "vitest"

import { map } from "./map"

describe("map", () => {
  test("normal", () => {
    expect(map(50, 0, 100, 0, 50)).toBe(25)
    expect(map(120, 0, 100, 0, 50)).toBe(60)
  })
  test("withinBounds", () => {
    expect(map(50, 0, 100, 0, 50, true)).toBe(25)
    expect(map(120, 0, 100, 0, 50, true)).toBe(50)
  })
})
