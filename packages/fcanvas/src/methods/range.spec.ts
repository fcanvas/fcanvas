import { describe, expect, test } from "vitest"

import { range } from "./range"

describe("range", () => {
  test("range(stop)", () => {
    expect([...range(10).values()]).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9])
  })
  test("range(start, stop)", () => {
    expect([...range(1, 10).values()]).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9])
  })
  test("range(start, stop, step)", () => {
    expect([...range(1, 10, 2).values()]).toEqual([1, 3, 5, 7, 9])
  })
})
