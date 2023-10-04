import { isError } from "./is-error"

describe("is-error", () => {
  test("work", () => {
    expect(isError(new Error())).toBe(true)
    expect(isError(new SyntaxError())).toBe(true)
    expect(isError(new RangeError())).toBe(true)

    expect(isError(0)).toBe(false)
  })
})
