import { describe, expect, test } from "vitest"

import { inRange } from "./inRange"
import { random } from "./random"

describe("random", () => {
  test("random number", () => {
    expect(inRange(random(100), 0, 100)).toEqual(true)
    expect(inRange(random(200), 0, 200)).toEqual(true)
    expect(inRange(random(300), 0, 300)).toEqual(true)
  })
  test("random array", () => {
    const array = [10, 2, -12, 0, 23, 432]

    expect(array).include(random(array))
    expect(array).include(random(array))
    expect(array).include(random(array))
  })
  test("random in range", () => {
    expect(inRange(random(0, 100), 0, 100)).toEqual(true)
    expect(inRange(random(-100, 200), -100, 200)).toEqual(true)
    expect(inRange(random(250, 300), 250, 300)).toEqual(true)
  })
})
