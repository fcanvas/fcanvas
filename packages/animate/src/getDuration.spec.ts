import { getDuration } from "./getDuration"

describe("getDuration", () => {
  test("getDuration(start, stop, speed)", () => {
    expect(getDuration(0, 1, 1)).toBe(1)
    expect(getDuration(1, 0, 1)).toBe(-1)
    expect(getDuration(0, 1, 2)).toBe(0.5)
    expect(getDuration(1, 0, 2)).toBe(-0.5)
  })
  test("getDuration(distance, speed)", () => {
    expect(getDuration(1, 1)).toBe(1)
    expect(getDuration(1, 2)).toBe(0.5)
    expect(getDuration(2, 1)).toBe(2)
    expect(getDuration(2, 2)).toBe(1)
    expect(getDuration(-1, 1)).toBe(-1)
  })
})
