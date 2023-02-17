import { describe, expect, test } from "vitest"

import { clamp } from "./clamp"

describe("clamp", () => {
  test("clamp(value, min, max)", () => {
    expect(clamp(12, 0, 100)).toBe(12)
    expect(clamp(-1212, 0, 100)).toBe(0)
    expect(clamp(200, 0, 100)).toBe(100)
  })
})
