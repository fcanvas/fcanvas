import { uuid } from "./uuid"

describe("uuid", () => {
  test("should work", () => {
    expect(uuid()).toBeTypeOf("string")
  })
})
