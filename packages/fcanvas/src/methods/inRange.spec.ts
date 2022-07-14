import { describe, expect, test } from "vitest"

import { inRange } from "./inRange"

describe("inRange", () => {
  test("inRange(value, start, stop)", () => {
    expect(inRange(12, 0, 100)).toEqual(true)
    expect(inRange(-1212, 0, 100)).toEqual(false)
    expect(inRange(200, 0, 100)).toEqual(false)
  })
})
