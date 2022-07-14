import { describe, expect, test } from "vitest"

import { lerp } from "./lerp"

describe("lerp", () => {
  test("lerp(start, stop, amt)", () => {
    expect(lerp(0, 100, 0.5)).toBe(50)
  })
})
