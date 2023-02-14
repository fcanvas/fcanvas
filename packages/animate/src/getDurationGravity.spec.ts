import { getDurationGravity } from "./getDurarionGravity"

describe("getDurationGravity", () => {
  test("getDurationGravity(hStart, hStop)", () => {
    expect(getDurationGravity(0, 1)).toBeTypeOf("number")
  })
  test("getDurationGravity(h)", () => {
    expect(getDurationGravity(1)).toBeTypeOf("number")
  })
})
